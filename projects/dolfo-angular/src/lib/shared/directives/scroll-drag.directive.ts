import { Directive, ElementRef } from "@angular/core"
import { filter, fromEvent } from "rxjs"
import { Subscriptable } from "../classes"

@Directive({
	selector: "[dolfoScrollDrag]",
    standalone: false
})
export class ScrollDragDirective extends Subscriptable {
	private mouseDownX: number
	private initialScrollX = 0
	private diffX = 0
	private mouseDownY: number
	private initialScrollY = 0
	private diffY = 0

	constructor(elementRef: ElementRef<HTMLElement>) {
		super()

		this.addSubscription(fromEvent<MouseEvent>(elementRef.nativeElement, "mousedown").pipe(
            filter(e => e.button === 0)
        ).subscribe(e => {
			e.preventDefault()
			e.stopPropagation()
			this.mouseDownX = e.clientX
			this.mouseDownY = e.clientY
			this.initialScrollX = elementRef.nativeElement.scrollLeft
			this.initialScrollY = elementRef.nativeElement.scrollTop
			elementRef.nativeElement.classList.add("dragging")
		}))

		this.addSubscription(fromEvent(document, "mouseup", { capture: true }).subscribe(() => {
			this.mouseDownX = null
			this.mouseDownY = null
			elementRef.nativeElement.classList.remove("dragging")
		}))

		this.addSubscription(fromEvent<Event>(elementRef.nativeElement, "click", { capture: true }).pipe(
			filter(() => this.diffX != 0 || this.diffY != 0)
		).subscribe(e => {
			e.stopPropagation()
			this.diffX = 0
			this.diffY = 0
		}))

		this.addSubscription(fromEvent<MouseEvent>(document, "mousemove").pipe(
			filter(() => this.mouseDownX != null || this.mouseDownY != null)
		).subscribe(e => {
			e.stopPropagation()

			if (this.mouseDownX != null) {
				this.diffX = this.initialScrollX + (this.mouseDownX - e.clientX)
				elementRef.nativeElement.scrollLeft = this.diffX
			}
			if (this.mouseDownY != null) {
				this.diffY = this.initialScrollY + (this.mouseDownY - e.clientY)
				elementRef.nativeElement.scrollTop = this.diffY
			}
		}))
	}
}
