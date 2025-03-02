import { Directive, ElementRef, Input } from "@angular/core"
import { filter, fromEvent } from "rxjs"
import { Subscriptable } from "../classes"
import { ITooltip, TooltipDirection } from "../interfaces"
import { TooltipService } from "../services"

@Directive({
    selector: "[dolfoTooltip]",
    standalone: false
})
export class TooltipDirective extends Subscriptable implements Omit<ITooltip, "elementRef">{
    @Input({ required: true, alias: "dolfoTooltip" }) content: string
    @Input() direction: TooltipDirection = "top"

    constructor(el: ElementRef<HTMLElement>, private ts: TooltipService) {
        super()

        this.addSubscription(fromEvent(el.nativeElement, "mousedown").pipe(
            filter(() => !!this.ts.getTooltip())
        ).subscribe(() => this.ts.hide()))

        this.addSubscription(
            fromEvent(el.nativeElement, "mouseenter").pipe(
                filter(() => !!this.content)
            ).subscribe(() => this.ts.showTooltip({
                content: this.content,
                elementRef: el,
                direction: this.direction
            }))
        )
    }
}
