import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-input-color",
    template: `<dolfo-input-container>
        <input type="color" [name]="formControlName" [formControl]="input" [checked]="input.value" />
    </dolfo-input-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputColorComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputColorComponent), multi: true },
        { provide: BaseFormInput, useExisting: InputColorComponent }
    ]
})
export class InputColorComponent extends BaseFormInput<string> {}
