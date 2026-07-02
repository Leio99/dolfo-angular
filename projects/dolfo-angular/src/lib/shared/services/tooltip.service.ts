import { Service } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { ITooltip } from "../interfaces"

@Service()
export class TooltipService {
    private tooltip$ = new BehaviorSubject<ITooltip>(null)

    public showTooltip = (input: ITooltip) => this.tooltip$.next(input)
    
    public getTooltip$ = () => this.tooltip$.asObservable()
    
    public getTooltip = () => this.tooltip$.getValue()

    public hide = () => this.tooltip$.next(null)
}
