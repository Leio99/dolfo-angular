import { ElementRef } from "@angular/core"

export interface ContextMenuItem{
    readonly label: string
    readonly onClick: () => void
    readonly disabled?: boolean
    readonly icon?: string
    readonly className?: string
}

export interface IContextMenu{
    readonly x: number
    readonly y: number
    readonly items: ContextMenuItem[]
    readonly ref: ElementRef<HTMLElement>
    readonly openOnClick?: boolean
    readonly position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}