import { booleanAttribute, Directive, ElementRef, Input, OnInit } from "@angular/core"
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

    constructor(private contextMenuService: ContextMenuService, private elRef: ElementRef<HTMLElement>) {
        super()
    }

    ngOnInit(){
        this.addSubscription(fromEvent<MouseEvent>(this.elRef.nativeElement, this.openOnClick ? "click" : "contextmenu").subscribe(e => {
            e.preventDefault()

            const [left, top] = this.getElRefPosition()

            this.contextMenuService.openContextMenu({
                x: this.useElRef ? left : e.clientX,
                y: this.useElRef ? top : e.clientY,
                items: this.contextMenu,
                ref: this.elRef,
                position: this.position
            })
        }))
    }

    private getElRefPosition = () => {
        const diff = this.elRef.nativeElement.offsetLeft + this.elRef.nativeElement.offsetWidth

        if(this.position.startsWith("bottom-")){
            const top = this.elRef.nativeElement.offsetTop + this.elRef.nativeElement.offsetHeight

            if(this.position === "bottom-left")
                return [this.elRef.nativeElement.offsetLeft, top]

            return [diff, top]
        }

        const top = this.elRef.nativeElement.offsetTop

        if(this.position === "top-right")
            return [diff, top]

        return [this.elRef.nativeElement.offsetLeft, top]
    }
}
