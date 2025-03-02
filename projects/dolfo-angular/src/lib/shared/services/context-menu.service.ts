import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { IContextMenu } from "../interfaces"

@Injectable({
    providedIn: "root"
})
export class ContextMenuService {
    private contextMenu$ = new BehaviorSubject<IContextMenu>(null)

    public getContextMenu$ = () => this.contextMenu$.asObservable()

    public openContextMenu = (input: IContextMenu) => this.contextMenu$.next(input)
}
