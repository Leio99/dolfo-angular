import { AfterViewInit, booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, signal, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { fromEvent, map } from "rxjs"
import { ComboInput, ComboOption } from "../../shared/interfaces"
import { OnBlur, OnFocus } from "../../shared/interfaces/events"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-combobox",
    template: `<dolfo-input-container>
		<div class="combobox" [class.opened]="opened()" #combo tabindex="0" (focus)="opened.set(true); onFocus.emit($event)" (blur)="onBlur.emit($event)">
			<div class="combobox-label">
				<span>{{ extractLabel() | translate }}</span>
			</div>

			<div class="combobox-options" [class.opened]="opened()">
				@for(opt of options; track opt.value; let idx = $index){
					<div class="combobox-option" [class.selected]="isSelected(opt)" [class.focused]="currentFocus() === idx" (click)="$event.stopPropagation(); setOption(opt)">
						<span>{{ opt.label }}</span>
					</div>
				}
			</div>

            <input type="hidden" [formControl]="input" />
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
export class ComboboxComponent extends BaseFormInput<number | number[]> implements AfterViewInit, Required<ComboInput>, OnBlur, OnFocus{
	@ViewChild("combo") combo: ElementRef<HTMLDivElement>
	@Input({ required: true }) options: ComboOption[]
	@Input() placeHolder: string
	@Input({ transform: booleanAttribute }) multiple = false
	@Output() onFocus = new EventEmitter<FocusEvent>()
	@Output() onBlur = new EventEmitter<FocusEvent>()

	public opened = signal(false)
    public currentFocus = signal<number>(null)

	constructor(private cdr: ChangeDetectorRef){
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

	override ngAfterViewInit() {
		super.ngAfterViewInit()

		this.addSubscription(fromEvent<KeyboardEvent>(this.combo.nativeElement, "keydown").subscribe(e => {
            if(this.opened()){
                if(e.key === "ArrowDown"){
                    e.preventDefault()
                    this.currentFocus.update(v => v === this.options.length - 1 ? 0 : v === null ? 0 : v + 1)
                }else if(e.key === "ArrowUp"){
                    e.preventDefault()
                    this.currentFocus.update(v => v === 0 ? this.options.length - 1 : v === null ? 0 : v - 1)
                }else if(e.key === "Enter" && this.currentFocus() >= 0 && this.currentFocus() != null){
                    e.preventDefault()
                    this.setOption(this.options[this.currentFocus()])

					if(!this.multiple)
						this.opened.set(false)

					this.cdr.detectChanges()
                }else if(e.key === "Tab"){
                    this.currentFocus.set(null)
                    this.opened.set(false)
                }
            }
        }))
	}

	public extractLabel = () => {
		const { value } = this.input

		if(value == null || (value as number[])?.length === 0)
			return this.placeHolder || " "

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

            this.opened.set(false)
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
