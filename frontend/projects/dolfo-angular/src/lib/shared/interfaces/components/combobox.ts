export interface ComboOption{
    readonly value: any
    readonly label: string
}

export interface ComboInput{
    readonly options?: ComboOption[]
	readonly placeHolder: string
    readonly multiple?: boolean
}