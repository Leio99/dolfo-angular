import { FormControl } from "@angular/forms"
import { ButtonColor } from "./button"
import { InputType } from "./form"
import { IconName } from "./icon"

export enum DialogActionType{ OK, NO, CANCEL }

export type DialogOutput = {
    type: DialogActionType
    data: Record<string, any>
}

export type DialogForm = {
    control: FormControl
    type: InputType | "date"
    name: string
}[]

export type DialogType = "info" | "confirm" | "loading" | "error"

export type IDialogInput = {
    title?: string
    message: string
    type?: DialogType
    width?: number
    hideCloseX?: boolean
    form?: DialogForm
    component?: DialogComponentInput
}

export interface DialogComponentInput{
    readonly type: new() => IDialogInput
    readonly input?: any
}

export type DialogIcon = {
    icon: string
    color: ButtonColor
}

export type DialogFooterButton = {
    label: string
    color: ButtonColor
    icon?: IconName
    disabled?: boolean
    loading?: boolean
    onClick: () => void
}