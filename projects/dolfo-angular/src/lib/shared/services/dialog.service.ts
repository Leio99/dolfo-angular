import { Injectable } from "@angular/core"
import { BehaviorSubject, filter } from "rxjs"
import { DialogComponentInput, DialogOutput, IDialogInput } from "../interfaces"
import { TranslateService } from "./translate.service"

@Injectable({
    providedIn: "root"
})
export class DialogService{
    private dialog$ = new BehaviorSubject<IDialogInput>(null)
    private waiter$: BehaviorSubject<DialogOutput>

    constructor(private ts: TranslateService){}

    public getDialog$ = () => this.dialog$.asObservable()

    public openDialog = (input: IDialogInput) => {
        this.waiter$?.complete()
        this.waiter$ = new BehaviorSubject<DialogOutput>(null)
        this.dialog$.next(input)

        return this.waiter$.pipe(
            filter(d => d != null)
        )
    }

    public openDialogComponent = (component: DialogComponentInput) => this.openDialog({
        message: null,
        component
    })

    public showLoading = (message = this.ts.translate("loading")) => this.openDialog({
        type: "loading",
        message
    })

    public close = () => {
        this.dialog$.next(null)
        this.waiter$?.complete()
    }

    public action = (action: DialogOutput) => this.waiter$.next(action)
}
