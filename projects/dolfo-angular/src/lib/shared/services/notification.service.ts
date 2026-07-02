import { Service } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { INotificationInput } from "../interfaces"

@Service()
export class NotificationService {
    private notification$ = new BehaviorSubject<INotificationInput>(null)
    private history$ = new BehaviorSubject<Array<INotificationInput & { date: Date }>>([])

    public getNotification$ = () => this.notification$.asObservable()

    public show = (input: INotificationInput) => {
        this.notification$.next(input)
        this.history$.next(this.history$.getValue().concat({ ...input, date: new Date() }))
    }

    public hide = () => this.notification$.next(null)

    public getHistory$ = () => this.history$.asObservable()
}
