import { booleanAttribute, Directive, ElementRef, inject, Input, OnInit } from "@angular/core"
import { fromEvent } from "rxjs"
import { Subscriptable } from "../classes"
import { ContextMenuItem } from "../interfaces"
import { ContextMenuService } from "../services"

@Directive({
    selector: "[dolfoContextMenu]",
    standalone: false
})
export class ContextMenuDirective extends Subscriptable implements OnInit{
    @Input({ required: true, alias: "dolfoContextMenu" }) contextMenu: ContextMenuItem[]
    @Input({ transform: booleanAttribute }) openOnClick: boolean
    @Input({ transform: booleanAttribute }) useElRef: boolean
    @Input() position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" = "bottom-left"
    private contextMenuService = inject(ContextMenuService)
    private elRef = inject(ElementRef<HTMLElement>)

    ngOnInit(){
        this.addSubscription(fromEvent<MouseEvent>(this.elRef.nativeElement, this.openOnClick ? "click" : "contextmenu").subscribe(e => {
            e.preventDefault()

            const [left, top] = this.useElRef ? this.getElRefPosition() : [e.clientX, e.clientY]

            this.contextMenuService.openContextMenu({
                x: left,
                y: top,
                items: this.contextMenu,
                ref: this.elRef,
                position: this.position
            })
        }))
    }

    private getElRefPosition = () => {
        const { left, width, top, height } = this.elRef.nativeElement.getBoundingClientRect()

        const diff = left + width

        if(this.position.startsWith("bottom-")){
            const posTop = top + height

            if(this.position === "bottom-left")
                return [left, posTop]

            return [diff, posTop]
        }

        if(this.position === "top-right")
            return [diff, top]

        return [left, top]
    }
}
