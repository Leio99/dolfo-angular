import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-input-checkbox",
    template: `<div class="input-checkbox">
        <input type="checkbox" [name]="formControlName" [formControl]="input" [checked]="input.value" />
        @if(label){
            <label (click)="toggleCheck()">{{ label }}</label>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputCheckboxComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputCheckboxComponent), multi: true },
        { provide: BaseFormInput, useExisting: InputCheckboxComponent }
    ]
})
export class InputCheckboxComponent extends BaseFormInput<boolean> {
    public toggleCheck = () => this.input.setValue(!this.input.value)
}
