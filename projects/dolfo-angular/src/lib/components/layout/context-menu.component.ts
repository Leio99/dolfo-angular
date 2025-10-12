import { ChangeDetectionStrategy, Component, ElementRef, inject, InjectionToken, Input, OnInit } from "@angular/core"
import { fromEvent, race } from "rxjs"
import { Subscriptable } from "../../shared/classes"
import { ContextMenuItem, IContextMenu } from "../../shared/interfaces"

export const CONTEXT_MENU_DESTROY_TOKEN = new InjectionToken<() => void>("CONTEXT_MENU_DESTROY_TOKEN")

@Component({
    selector: "dolfo-context-menu",
    standalone: false,
    template: `<div class="context-menu" [ngStyle]="{
        top: y + 'px',
        left: x + 'px'
    }" (click)="$event.stopPropagation()" [ngClass]="'position-' + position">
        @for(item of items; track item.label){
            <div [ngClass]="item.className" [class.disabled]="item.disabled" (click)="clickItem(item)">
                @if(item.icon){
                    <dolfo-icon [name]="item.icon"></dolfo-icon>
                }
                {{ item.label }}
            </div>
            }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent extends Subscriptable implements IContextMenu, OnInit {
    @Input({ required: true }) x: number
    @Input({ required: true }) y: number
    @Input({ required: true }) items: ContextMenuItem[]
    @Input({ required: true }) ref: ElementRef<HTMLElement>
    @Input() position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    
    private destroyFn = inject(CONTEXT_MENU_DESTROY_TOKEN)

    ngOnInit() {
        this.addSubscription(race([
            fromEvent(this.ref.nativeElement, "contextmenu"),
            fromEvent(window, "click"),
            fromEvent(window, "resize"),
            fromEvent(window, "scroll", { capture: true })
        ]).subscribe(this.destroyFn))
    }

    public clickItem = (item: ContextMenuItem) => {
        if(item.onClick && !item.disabled){
            item.onClick()
            this.destroyFn()
        }
    }
}
