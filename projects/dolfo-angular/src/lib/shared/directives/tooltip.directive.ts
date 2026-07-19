import { Directive, ElementRef, inject, Input } from "@angular/core"
import { filter, fromEvent } from "rxjs"
import { Subscriptable } from "../classes/subscriptable"
import { ITooltip, TooltipDirection } from "../interfaces"
import { TooltipService } from "../services"

@Directive({
    selector: "[dolfoTooltip]",
    standalone: false
})
export class TooltipDirective extends Subscriptable implements Omit<ITooltip, "elementRef">{
    @Input({ required: true, alias: "dolfoTooltip" }) content: string
    @Input() direction: TooltipDirection = "top"
    private el = inject(ElementRef)
    private ts = inject(TooltipService)

    constructor() {
        super()

        this.addSubscription(fromEvent(this.el.nativeElement, "mousedown").pipe(
            filter(() => !!this.ts.getTooltip())
        ).subscribe(() => this.ts.hide()))

        this.addSubscription(
            fromEvent(this.el.nativeElement, "mouseenter").pipe(
                filter(() => !!this.content)
            ).subscribe(() => this.ts.showTooltip({
                content: this.content,
                elementRef: this.el,
                direction: this.direction
            }))
        )
    }
}
