import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { IPopover } from "../interfaces"

@Injectable({
    providedIn: "root"
})
export class PopoverService {
    private popover$ = new BehaviorSubject<IPopover>(null)

    public getPopover$ = () => this.popover$.asObservable()

    public getPopover = () => this.popover$.getValue()

    public showPopover = (input: IPopover) => this.popover$.next(input)

    public hide = () => this.popover$.next(null)
}