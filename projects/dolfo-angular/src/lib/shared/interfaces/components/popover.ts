import { TemplateRef } from "@angular/core"
import { ITooltip } from "./tooltip"

export interface IPopover extends Omit<ITooltip, "content">{
    readonly content: string | TemplateRef<any>
}