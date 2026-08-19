import { BehaviorSubject, map, Observable, Subscription } from "rxjs"
import { ButtonColor } from "./button"
import { ContextMenuItem } from "./context-menu"

export enum ColumnAlign{
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center"
}

export enum ColumnDataType{ TEXT, DATE, DATETIME, LINK }

export interface GridAction{
    readonly icon: string
    readonly title?: string
    readonly disabled?: boolean
    readonly color?: ButtonColor
    readonly onClick: () => void
}

export type BooleanFn = () => boolean

export interface GridToolbarButton{
    readonly label: string
    readonly disabled?: boolean | BooleanFn
    readonly icon?: string
    readonly onClick: () => void
}

export interface GridColumn{
    readonly label: string
    readonly field: string
    readonly dataType: ColumnDataType
    readonly width?: number
    readonly align?: ColumnAlign
    readonly formatter?: (value: any) => string
    readonly onLink?: (value: any) => void
}

export interface IGridConfig<T>{
    readonly items: T[] | Observable<T[]>
    readonly columns: GridColumn[]
    readonly selection?: {
        readonly type?: "single" | "multiple"
        readonly showSelectAll?: boolean
        readonly defaultSelected?: (item: T) => boolean
    }
    readonly toolbar?: {
        readonly buttons?: GridToolbarButton[]
    }
    readonly events?: {
        onRowClick?: (item: T) => void
        onSelectionChange?: (item: T[]) => void
    }
    readonly getItemKey: (item: T) => string | number
    readonly actions?: (item: T) => ContextMenuItem[]
    readonly rowClass?: (item: T) => string
}

export class GridConfig<T>{
    private items$ = new BehaviorSubject<T[]>([])
    private loading$ = new BehaviorSubject(false)
    private selectedItems: T[]
    private actions$ = new BehaviorSubject<IGridConfig<T>["actions"]>(null)
    private toolbar: IGridConfig<T>["toolbar"]
    private prevSub: Subscription

    constructor(private config: IGridConfig<T>){
        this.refreshGrid()
        this.actions$.next(config.actions)

        if(config.toolbar)
            this.toolbar = config.toolbar
    }

    public refreshGrid = () => {
        this.selectedItems = []

        this.prevSub?.unsubscribe()

        if(Array.isArray(this.config.items))
            this.items$.next(this.config.items)
        else{
            this.setLoading(true)

            this.prevSub = this.config.items.subscribe(it => {
                this.setLoading(false)
                this.items$.next(it)
                
                if(this.getSelectionConfig()?.defaultSelected)
                    this.selectedItems = it.filter(i => this.getSelectionConfig().defaultSelected(i))
            })
        }
    }

    public getRowClass = (item: T) => this.config.rowClass?.(item)

    public updateList = (newList: T[]) => this.items$.next(newList)

    public getList = () => this.items$.getValue()

    public getList$ = () => this.items$.asObservable()

    public getActions$ = (item: T) => this.actions$.asObservable().pipe(
        map(actions => actions?.(item))
    )

    public setActions = (actions: IGridConfig<T>["actions"]) => this.actions$.next(actions)

    public getColumns = () => this.config.columns

    public getEvents = () => this.config.events

    public getUniqueId = (item: T) => this.config.getItemKey(item)

    public isLoading$ = () => this.loading$.asObservable()

    public setLoading = (v: boolean) => this.loading$.next(v)

    public getSelectedItems = () => this.items$.getValue().filter(it => this.selectedItems.some(d => this.getUniqueId(d) === this.getUniqueId(it)))

    public toggleSelection = (item: T) => {
        if(this.isItemSelected(item))
            this.selectedItems = this.selectedItems.filter(it => this.getUniqueId(it) !== this.getUniqueId(item))
        else if(this.config.selection?.type === "single")
            this.selectedItems = [item]
        else
            this.selectedItems.push(item)

        this.emitSelectionChange()
    }

    public isItemSelected = (item: T) => this.selectedItems.some(d => this.getUniqueId(d) === this.getUniqueId(item))

    public toggleSelectAll = () => {
        if(this.isAllSelected())
            this.selectedItems = []
        else
            this.selectedItems = this.items$.getValue()

        this.emitSelectionChange()
    }

    public getSelectionConfig = () => this.config.selection

    private emitSelectionChange = () => this.config.events?.onSelectionChange?.(this.getSelectedItems())

    public isAllSelected = () => this.selectedItems.length === this.items$.getValue().length

    public get hasActions(){
        return !!this.actions$.getValue()
    }

    public get hasToolbar(){
        return !!this.toolbar
    }

    public getToolbarButtons(){
        return this.toolbar.buttons
    }

    public setToolbar = (toolbar: IGridConfig<T>["toolbar"]) => this.toolbar = toolbar
}