import { DatePipe } from "@angular/common"
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, inject, Input, OnInit, Output, signal, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { OnBlur, OnFocus } from "../../shared/interfaces/events"
import { BaseFormInput } from "./base-form-input"

@Component({
	selector: "dolfo-datepicker",
	template: `<dolfo-input-container>
		<input #formInput [type]="type === 'datetime' ? 'datetime-local' : type" [value]="currentValue()" (focus)="openPicker(); onFocus.emit($event)" (blur)="onBlur.emit($event)" (input)="onChangeDate($event)" />
	</dolfo-input-container>`,
	standalone: false,
	providers: [
        DatePipe,
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatepickerComponent), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => DatepickerComponent), multi: true },
		{ provide: BaseFormInput, useExisting: DatepickerComponent }
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent extends BaseFormInput<Date> implements OnInit, OnFocus, OnBlur{
    @ViewChild("formInput") private formInput: ElementRef<HTMLInputElement>
    @Input() type: "date" | "datetime" | "time" = "date"
	@Output() onFocus = new EventEmitter<FocusEvent>()
	@Output() onBlur = new EventEmitter<FocusEvent>()
    public currentValue = signal<string>(null)
    public dp = inject(DatePipe)

    public openPicker = () => this.formInput.nativeElement.showPicker()

    override ngOnInit(){
        super.ngOnInit()

        this.addSubscription(this.input.valueChanges.subscribe(value => {
            if(!value)
                this.currentValue.set(null)
            else if(this.type === "date")
                this.currentValue.set(this.dp.transform(value, "yyyy-MM-dd"))
            else if(this.type === "datetime")
                this.currentValue.set(this.dp.transform(value, "yyyy-MM-ddTHH:mm"))
            else if(this.type === "time")
                this.currentValue.set(this.dp.transform(value, "HH:mm"))
        }))
    }

    public onChangeDate = (e: Event) => {
        const { value } = e.target as HTMLInputElement

        if(!value)
            this.input.setValue(null)
        else{
            let date: Date

            if(this.type === "date" || this.type === "datetime"){
                date = new Date(value)

                if(this.type === "date")
                    date.setHours(0, 0, 0, 0)
            }else if(this.type === "time"){
                const [hours, minutes] = value.split(":")
                date = new Date()
                date.setHours(Number(hours), Number(minutes), 0, 0)
            }

            this.input.setValue(date)
        }
    }
}
