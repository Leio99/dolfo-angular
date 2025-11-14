import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, InjectionToken, Input, OnInit, TemplateRef, ViewChild } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"
import { BehaviorSubject, filter, fromEvent, map, race, zip } from "rxjs"
import { Subscriptable } from "../../shared/classes"
import { IPopover, TooltipDirection } from "../../shared/interfaces"

export const POPOVER_DESTROY_TOKEN = new InjectionToken<() => void>("POPOVER_DESTROY_TOKEN")

@Component({
    selector: "dolfo-popover",
    standalone: false,
    template: `<div class="tooltip popover" #tooltipRef [ngStyle]="{
        left: (x$ | async) + 'px',
        top: (y$ | async) + 'px'
    }" [ngClass]="currentDirection$ | async" [class.show]="completed$ | async">
        @if(isTemplate()){
            <ng-container [ngTemplateOutlet]="getContentTemplate()"></ng-container>
        }@else{
            <div [innerHTML]="getContentStr()"></div>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverComponent extends Subscriptable implements OnInit, AfterViewInit, Required<IPopover> {
    @ViewChild("tooltipRef") tooltipRef: ElementRef<HTMLDivElement>
    @Input({ required: true }) content: string | TemplateRef<any>
    @Input({ required: true }) elementRef: ElementRef<HTMLElement>
    @Input({ required: true }) direction: TooltipDirection

    private destroyFn = inject(POPOVER_DESTROY_TOKEN)
    private checkCount = 0

    public currentDirection$ = new BehaviorSubject<TooltipDirection>(null)
    public completed$ = new BehaviorSubject(false)
    public readonly x$ = new BehaviorSubject(0)
    public readonly y$ = new BehaviorSubject(0)

    constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {
        super()
    }

    ngOnInit() {
        this.currentDirection$.next(this.direction)

        this.addSubscription(race([
            fromEvent(window, "resize"),
            fromEvent(window, "scroll", { capture: true }),
            fromEvent<MouseEvent>(window, "click").pipe(
                map(e => e.target as HTMLElement),
                filter(el => !el.isEqualNode(this.tooltipRef.nativeElement) && !this.tooltipRef.nativeElement.contains(el))
            )
        ]).subscribe(this.destroyFn))

        this.addSubscription(zip([this.x$, this.y$]).pipe(
            filter(([x, y]) => x != 0 && y != 0 && this.checkCount < 4)
        ).subscribe(() => {
            setTimeout(() => {
                if (this.isTooltipInViewport()) {
                    this.completed$.next(true)
                    this.calculatePosition()
                    return
                }

                if (this.currentDirection$.getValue() === "bottom")
                    this.currentDirection$.next("left")
                else if (this.currentDirection$.getValue() === "left")
                    this.currentDirection$.next("top")
                else if (this.currentDirection$.getValue() === "top")
                    this.currentDirection$.next("right")
                else
                    this.currentDirection$.next("bottom")
            })
        }))
    }

    ngAfterViewInit() {
        this.addSubscription(this.currentDirection$.asObservable().subscribe(() => setTimeout(() => this.calculatePosition())))
    }

    private calculatePosition = () => {
        const { elementRef, tooltipRef, currentDirection$ } = this,
            refRect = elementRef.nativeElement.getBoundingClientRect(),
            tooltipRect = tooltipRef.nativeElement.getBoundingClientRect(),
            currentDirection = currentDirection$.getValue()

        if (currentDirection === "top" || currentDirection === "bottom")
            this.x$.next(refRect.left - ((tooltipRect.width - refRect.width) / 2))
        else if (currentDirection === "right")
            this.x$.next(refRect.left + refRect.width)
        else
            this.x$.next(refRect.left - tooltipRect.width)

        if (currentDirection === "top")
            this.y$.next(refRect.top - tooltipRect.height)
        else if (currentDirection === "bottom")
            this.y$.next(refRect.top + refRect.height)
        else
            this.y$.next(refRect.top - ((tooltipRect.height - refRect.height) / 2))

        this.cdr.detectChanges()
        this.checkCount++
    }

    private isTooltipInViewport = () => {
        const { top, left, bottom, right } = this.tooltipRef.nativeElement.getBoundingClientRect()
        return top >= 0 && left >= 0 && bottom <= window.innerHeight && right <= window.innerWidth
    }

    public getContentStr = () => this.sanitizer.bypassSecurityTrustHtml(this.content as string)

    public isTemplate = () => this.content instanceof TemplateRef

    public getContentTemplate = () => this.content as TemplateRef<any>
}
