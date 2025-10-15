import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { ComboOption, isDeepEqual } from "../../shared/interfaces"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-input-radio",
    template: `<dolfo-input-container>
        @for(option of options; track option){
            <div class="radio-item">
                <input type="radio" [name]="formControlName" [formControl]="input" [checked]="isSelectedOption(option)" [value]="option.value" />
                <label (click)="setOption(option)">{{ option.label }}</label>
            </div>
        }
    </dolfo-input-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputRadioComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputRadioComponent), multi: true },
        { provide: BaseFormInput, useExisting: InputRadioComponent }
    ]
})
export class InputRadioComponent extends BaseFormInput<any> {
    @Input({ required: true }) options: ComboOption[]

    public isSelectedOption = (opt: ComboOption) => isDeepEqual(this.input.value, opt.value)

    public setOption = (opt: ComboOption) => {
        if(this.input.disabled)
            return
        
        this.input.setValue(opt.value)
        this.onChange.emit(this.input.value)
    }
}
