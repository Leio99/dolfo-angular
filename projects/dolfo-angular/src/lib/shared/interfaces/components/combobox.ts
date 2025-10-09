import { Observable } from "rxjs"

export interface ComboOption{
    readonly value: any
    readonly label: string
}

export interface ComboInput{
    readonly options?: ComboOption[]
	readonly placeHolder: string
    readonly multiple?: boolean
}

export interface ComboboxConfig<T>{
    search$: (filter: string) => Observable<T[]>
    getLabel: (item: T) => string
}