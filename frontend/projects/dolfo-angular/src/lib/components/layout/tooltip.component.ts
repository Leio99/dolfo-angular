import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, InjectionToken, Input, OnInit, ViewChild } from "@angular/core"
import { BehaviorSubject, filter, fromEvent, Observable, race, zip } from "rxjs"
import { Subscriptable } from "../../shared/classes"
import { ITooltip, TooltipDirection } from "../../shared/interfaces"

export const TOOLTIP_DESTROY_TOKEN = new InjectionToken<() => void>("TOOLTIP_DESTROY_TOKEN")

@Component({
    selector: "dolfo-tooltip",
    standalone: false,
    template: `<div class="tooltip" #tooltipRef [ngStyle]="{
        left: (x$ | async) + 'px',
        top: (y$ | async) + 'px'
    }" [ngClass]="currentDirection$ | async" [class.show]="completed$ | async">
        {{ content }}
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent extends Subscriptable implements OnInit, AfterViewInit, Required<ITooltip> {
    @ViewChild("tooltipRef") tooltipRef: ElementRef<HTMLDivElement>
    @Input({ required: true }) content: string
    @Input({ required: true }) elementRef: ElementRef<HTMLElement>
    @Input({ required: true }) direction: TooltipDirection
    
    private destroyFn = inject(TOOLTIP_DESTROY_TOKEN)
    private checkCount = 0

    public currentDirection$ = new BehaviorSubject<TooltipDirection>(null)
    public completed$ = new BehaviorSubject(false)
    public readonly x$ = new BehaviorSubject(0)
    public readonly y$ = new BehaviorSubject(0)

    constructor(private cdr: ChangeDetectorRef) {
        super()
    }

    ngOnInit() {
        this.currentDirection$.next(this.direction)

        this.addSubscription(race([
            fromEvent(window, "resize"),
            fromEvent(window, "scroll", { capture: true }),
            fromEvent(this.elementRef.nativeElement, "mouseleave"),
            this.observeOnMutation(document.body, { childList: true, subtree: true }).pipe(
                filter(events => events.some(e => Array.from(e.removedNodes).some(d => d.isEqualNode(this.elementRef.nativeElement) || d.contains(this.elementRef.nativeElement))))
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

    private observeOnMutation = (target: HTMLElement, config: MutationObserverInit) => new Observable<MutationRecord[]>(observer => {
        const mutation = new MutationObserver(mutations => observer.next(mutations))
        mutation.observe(target, config)
        return () => mutation.disconnect()
    })

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
}