import { Injectable, signal } from "@angular/core"
import { BehaviorSubject, filter, fromEvent, tap, zip } from "rxjs"
// ! Importante che venga importato con percorso preciso
import { Subscriptable } from "../classes/subscriptable"
import { IStore, StorageListType, StoreLists } from "../interfaces"

@Injectable({
    providedIn: "root"
})
export class StoreService extends Subscriptable {
    private appInitialized = signal(false)

    constructor(){
        super()

        this.addSubscription(zip([
            fromEvent<KeyboardEvent>(window, "keydown").pipe(
                filter(e => !this.isPressingCtrl() && e.ctrlKey),
                tap(() => this.setCtrlKey(true))
            ),
            fromEvent<KeyboardEvent>(window, "keyup").pipe(
                filter(e => this.isPressingCtrl() && e.key === "Control"),
                tap(() => this.setCtrlKey(false))
            ),
            fromEvent<KeyboardEvent>(window, "blur").pipe(
                filter(() => this.isPressingCtrl()),
                tap(() => this.setCtrlKey(false))
            )
        ]).subscribe())
    }

    private store$ = new BehaviorSubject<IStore>({
        lists: {},
        entities: {},
        pressingCtrl: false
    })

    public addList = <K extends StoreLists>(key: K, list: StorageListType[K][]) => this.store$.next({
        ...this.store$.getValue(),
        lists: {
            ...this.store$.getValue().lists,
            [key]: list
        }
    })

    public getList = <K extends StoreLists>(key: K) => this.store$.getValue().lists[key] as StorageListType[K][]

    public addEntity = (key: string, entity: any) => this.store$.next({
        ...this.store$.getValue(),
        entities: {
            ...this.store$.getValue().entities,
            [key]: entity
        }
    })

    public getEntity = <T>(key: string) => this.store$.getValue().entities[key] as T

    public setCtrlKey = (pressingCtrl: boolean) => this.store$.next({
        ...this.store$.getValue(),
        pressingCtrl
    })

    public isPressingCtrl = () => this.store$.getValue().pressingCtrl

    public isInitialized = () => this.appInitialized()

    public initialize = () => this.appInitialized.set(true)
}
