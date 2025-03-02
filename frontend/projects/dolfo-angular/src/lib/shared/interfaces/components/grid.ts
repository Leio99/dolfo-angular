import { BehaviorSubject, Observable } from "rxjs"
import { ButtonColor } from "./button"
import { ContextMenuItem } from "./context-menu"

export enum ColumnAlign{
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center"
}

export enum ColumnDataType{ TEXT, DATE }

export interface GridAction{
    readonly icon: string
    readonly title?: string
    readonly disabled?: boolean
    readonly color?: ButtonColor
    readonly onClick: () => void
}

export interface GridColumn{
    readonly label: string
    readonly field: string
    readonly dataType: ColumnDataType
    readonly width?: number
    readonly align?: ColumnAlign
    readonly formatter?: (value: any) => string
}

export interface IGridConfig<T>{
    readonly items: T[] | Observable<T[]>
    readonly columns: GridColumn[]
    readonly getItemKey: (item: T) => string | number
    readonly actions?: (item: T) => ContextMenuItem[]
    readonly rowClass?: (item: T) => string
    readonly events?: {
        onRowClick?: (item: T) => void
    }
}

export class GridConfig<T>{
    private items$ = new BehaviorSubject<T[]>([])
    private loading$ = new BehaviorSubject(false)

    constructor(private config: IGridConfig<T>){
        this.refreshGrid()
    }

    public refreshGrid = () => {
        if(Array.isArray(this.config.items))
            this.items$.next(this.config.items)
        else{
            this.toggleLoading()

            this.config.items.subscribe(it => {
                this.toggleLoading()
                this.items$.next(it)
            })
        }
    }

    public getRowClass = (item: T) => this.config.rowClass?.(item)

    public updateList = (newList: T[]) => this.items$.next(newList)

    public getList = () => this.items$.getValue()

    public getList$ = () => this.items$.asObservable()

    public getActions = (item: T) => this.config.actions?.(item)

    public getColumns = () => this.config.columns

    public getEvents = () => this.config.events

    public getUniqueId = (item: T) => this.config.getItemKey(item)

    public isLoading$ = () => this.loading$.asObservable()

    public toggleLoading = () => this.loading$.next(!this.loading$.getValue())

    public get hasActions(){
        return !!this.config.actions
    }
}