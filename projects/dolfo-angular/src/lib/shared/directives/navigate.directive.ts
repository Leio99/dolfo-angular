import { APP_BASE_HREF } from "@angular/common"
import { Directive, ElementRef, inject, Input, SimpleChanges } from "@angular/core"
import { Router } from "@angular/router"
import { filter, fromEvent } from "rxjs"
import { Subscriptable } from "../classes"
import { StoreService } from "../services"

@Directive({
    selector: "[dolfoNavigate]",
    standalone: false
})
export class NavigateDirective extends Subscriptable{
    @Input({ required: true, alias: "dolfoNavigate" }) url: string
    private isLink: boolean
    private publicUrl = inject(APP_BASE_HREF)
    private storeService = inject(StoreService)
    private router = inject(Router)
    private elementRef = inject(ElementRef)

    constructor() {
        super()

        this.isLink = this.elementRef.nativeElement.tagName.toLowerCase() === "a"

        this.addSubscription(fromEvent<MouseEvent>(this.elementRef.nativeElement, "click").subscribe(e => {
            if(this.isLink)
                e.preventDefault()
            
            if(this.storeService.isPressingCtrl())
                this.openBlank()
            else
                this.router.navigateByUrl(this.url)
        }))

        this.addSubscription(fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown").pipe(
            filter(e => e.button === 1)
        ).subscribe(e => {
            if(this.isLink)
                e.stopPropagation()
            else
                this.openBlank()
        }))
    }
    
    ngOnChanges(changes: SimpleChanges<this>){
        if((this.isLink || (changes.url && changes.url.currentValue !== this.url)) && !!this.url)
            this.elementRef.nativeElement.setAttribute("href", this.url)
    }

    private openBlank = () => window.open(this.publicUrl + this.url, "_blank")
}