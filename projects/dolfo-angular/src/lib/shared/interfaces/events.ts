import { EventEmitter } from "@angular/core"

export interface OnFocus{
    onFocus: EventEmitter<FocusEvent>
}

export interface OnBlur{
    onBlur: EventEmitter<FocusEvent>
}

export interface OnClick{
    onClick: EventEmitter<MouseEvent>
}