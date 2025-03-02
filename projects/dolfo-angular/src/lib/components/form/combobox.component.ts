import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, signal, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { fromEvent, map } from "rxjs"
import { ComboInput, ComboOption } from "../../shared/interfaces"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-combobox",
    template: `<dolfo-input-container>
		<div class="combobox" [class.opened]="opened()" #combo>
			<div class="combobox-label">
				<span>{{ extractLabel() | translate }}</span>
			</div>

			<div class="combobox-options" [class.opened]="opened()">
				@for(opt of options; track opt.value){
					<div class="combobox-option" [class.selected]="isSelected(opt)" (click)="$event.stopPropagation(); setOption(opt)">
						<span>{{ opt.label }}</span>
					</div>
				}
			</div>
		</div>
	</dolfo-input-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ComboboxComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ComboboxComponent), multi: true },
        { provide: BaseFormInput, useExisting: ComboboxComponent }
    ],
    standalone: false
})
export class ComboboxComponent extends BaseFormInput<number | number[]> implements Required<ComboInput>{
	@Input({ required: true }) options: ComboOption[]
	@Input({ required: true }) placeHolder: string
	@Input() multiple = false
	@ViewChild("combo") combo: ElementRef<HTMLDivElement>

	public opened = signal(false)

	constructor(){
		super()

		this.addSubscription(fromEvent(window, "click").pipe(
			map(ev => ev.target as HTMLElement),
			map(target => !this.combo.nativeElement.contains(target) && !target.isEqualNode(this.combo.nativeElement))
		).subscribe(condition => {
			if(condition && this.opened())
				this.opened.set(false)
			else if(!this.opened() && !condition)
				this.opened.set(true)
		}))
	}

	public extractLabel = () => {
		const { value } = this.input

		if(value == null || (value as number[])?.length === 0)
			return this.placeHolder

		if(!this.multiple)
			return this.options.find(opt => opt.value === value).label

		return this.options.filter(opt => (value as number[]).includes(opt.value)).map(opt => opt.label).join(", ")
	}

	public setOption = (opt: ComboOption) => {
		const { value } = this.input

		if(!this.multiple){
			if(value === opt.value)
				this.input.setValue(null)
			else
				this.input.setValue(opt.value)
		}else{
			const castValue = value as number[]

			if(castValue.includes(opt.value))
				this.input.setValue(castValue.filter(v => v !== opt.value))
			else
				this.input.setValue(castValue.concat(opt.value))
		}

		this.onChange.emit(this.input.value)
	}

	public isSelected = (opt: ComboOption) => {
		const { value } = this.input

		if(!this.multiple)
			return value === opt.value

		return (value as number[]).includes(opt.value)
	}
}
