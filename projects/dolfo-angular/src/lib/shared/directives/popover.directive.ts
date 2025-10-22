import { Directive, ElementRef, Input, TemplateRef } from "@angular/core"
import { filter, fromEvent } from "rxjs"
import { Subscriptable } from "../classes"
import { TooltipDirection } from "../interfaces"
import { PopoverService } from "../services"

@Directive({
    selector: "[dolfoPopover]",
    standalone: false
})
export class PopoverDirective extends Subscriptable{
    @Input({ required: true, alias: "dolfoPopover" }) content: string | TemplateRef<any>
    @Input() direction: TooltipDirection = "top"

    constructor(private el: ElementRef<HTMLElement>, private ps: PopoverService) {
        super()
    }

    ngOnInit(){
        this.addSubscription(fromEvent(this.el.nativeElement, "mousedown").pipe(
            filter(() => !!this.ps.getPopover())
        ).subscribe(() => this.ps.hide()))

        this.addSubscription(
            fromEvent(this.el.nativeElement, "click").pipe(
                filter(() => !!this.content)
            ).subscribe(() => this.ps.showPopover({
                content: this.content,
                elementRef: this.el,
                direction: this.direction
            }))
        )
    }
}
