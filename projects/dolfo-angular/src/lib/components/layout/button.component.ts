import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core"
import { ButtonColor, ButtonSize } from "../../shared/interfaces"
import { OnBlur, OnClick, OnFocus } from "../../shared/interfaces/events"

@Component({
    selector: "dolfo-button",
    template: `<button #btn [type]="type" [disabled]="disabled || loading" (click)="doClick($event)" [class]="'color-' + (color || 'primary')" (focus)="onFocus.emit($event)" (blur)="onFocus.emit($event)" [class.size-sm]="size === 'small'" [class.size-lg]="size === 'large'">
        @if(loading){
            <dolfo-icon name="spinner8"></dolfo-icon>
        }
        <ng-content></ng-content>
    </button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ButtonComponent implements OnClick, OnBlur, OnFocus{
    @ViewChild("btn") btn: ElementRef<HTMLButtonElement>
    @Input() type: "button" | "submit" = "button"
    @Input({ transform: booleanAttribute }) disabled = false
    @Input() color: ButtonColor
    @Input() loading = false
    @Input() size: ButtonSize

    @Output() onClick = new EventEmitter<MouseEvent>()
    @Output() onBlur = new EventEmitter<FocusEvent>()
    @Output() onFocus = new EventEmitter<FocusEvent>()

    public doClick = (e: MouseEvent) => {
        if (!this.disabled && !this.loading)
            this.onClick.emit(e)
    }

    public focus = () => {
        if(!this.disabled && !this.loading)
            this.btn.nativeElement.focus()
    }
}
