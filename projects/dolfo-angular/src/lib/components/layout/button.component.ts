import { booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core"
import { ButtonColor } from "../../shared/interfaces"

@Component({
    selector: "dolfo-button",
    template: `<button [type]="type" [disabled]="disabled || loading" (click)="doClick()" [class]="'color-' + (color || 'primary')">
        @if(loading){
            <dolfo-icon name="spinner8"></dolfo-icon>
        }
        <ng-content></ng-content>
    </button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ButtonComponent {
    @Input() type: "button" | "submit" = "button"
    @Input({ transform: booleanAttribute }) disabled = false
    @Input() color: ButtonColor
    @Input() loading = false

    @Output() onClick = new EventEmitter()

    public doClick() {
        if (!this.disabled)
            this.onClick.emit()
    }
}
