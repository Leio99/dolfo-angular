import { Injectable } from "@angular/core"
import { BehaviorSubject, filter } from "rxjs"
import { DialogComponentInput, DialogOutput, IDialogInput } from "../interfaces"
import { TranslateService } from "./translate.service"

@Injectable({
    providedIn: "root"
})
export class DialogService{
    private dialog$ = new BehaviorSubject<(IDialogInput & { _dialogId: number })[]>([])
    private waiters: BehaviorSubject<DialogOutput>[] = []

    constructor(private ts: TranslateService){}

    private getLastWaiter = () => this.waiters[this.waiters.length - 1]

    public getDialog = () => this.dialog$.getValue()

    public getDialog$ = () => this.dialog$.asObservable()

    public openDialog = (input: IDialogInput) => {
        const newWaiter$ = new BehaviorSubject<DialogOutput>(null)
        this.waiters.push(newWaiter$)
        this.dialog$.next(this.dialog$.getValue().concat({
            ...input,
            _dialogId: new Date().getTime()
        }))

        return this.getLastWaiter().pipe(
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
        const v = this.dialog$.getValue()
        this.dialog$.next(v.slice(0, v.length - 1))
        this.getLastWaiter()?.complete()
        this.waiters = this.waiters.slice(0, this.waiters.length - 1)
    }

    public action = (action: DialogOutput) => this.getLastWaiter().next(action)
}
