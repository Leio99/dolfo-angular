import { Injectable, signal } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { IStore, StorageListType, StoreLists } from "../interfaces"

@Injectable({
    providedIn: "root"
})
export class StoreService {
    private appInitialized = signal(false)

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
