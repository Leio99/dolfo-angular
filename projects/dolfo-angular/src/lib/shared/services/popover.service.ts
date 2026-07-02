import { Service } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { IPopover } from "../interfaces"

@Service()
export class PopoverService {
    private popover$ = new BehaviorSubject<IPopover>(null)

    public getPopover$ = () => this.popover$.asObservable()

    public getPopover = () => this.popover$.getValue()

    public showPopover = (input: IPopover) => this.popover$.next(input)

    public hide = () => this.popover$.next(null)
}