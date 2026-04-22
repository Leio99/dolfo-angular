import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from "@angular/core"
import { FormGroup } from "@angular/forms"

@Component({
    selector: "dolfo-form",
    template: `<form [formGroup]="formGroup">
        <ng-content></ng-content>

        @if(hiddenSubmit){
            <button type="submit" [ngStyle]="{ display: 'none' }"></button>
        }
    </form>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FormComponent{
    @Input({ required: true }) formGroup: FormGroup
    @Input({ transform:booleanAttribute }) hiddenSubmit: boolean
}
