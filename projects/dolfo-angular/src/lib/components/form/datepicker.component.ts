import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { BaseFormInput } from "./base-form-input"

@Component({
	selector: "dolfo-datepicker",
	template: `<dolfo-input-container>
		<input #formInput [type]="selectTime ? 'datetime-local' : 'date'" [formControl]="input" (focus)="openPicker()" />
	</dolfo-input-container>`,
	standalone: false,
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatepickerComponent), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => DatepickerComponent), multi: true },
		{ provide: BaseFormInput, useExisting: DatepickerComponent }
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent extends BaseFormInput<Date> {
    @ViewChild("formInput") formInput: ElementRef<HTMLInputElement>
    @Input({ transform: booleanAttribute }) selectTime = false

    public openPicker = () => this.formInput.nativeElement.showPicker()
}
