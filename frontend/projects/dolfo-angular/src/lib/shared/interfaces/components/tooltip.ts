import { ElementRef } from "@angular/core"

export type ITooltip = {
    content: string
    elementRef: ElementRef<HTMLElement>
    direction?: TooltipDirection
}

export type TooltipDirection = "top" | "right" | "bottom" | "left"