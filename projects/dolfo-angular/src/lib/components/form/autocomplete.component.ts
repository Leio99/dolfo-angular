import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Input, Output, signal, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { delay, filter, fromEvent, map, mergeMap, tap } from "rxjs"
import { ComboboxConfig, ComboOption } from "../../shared/interfaces"
import { OnBlur, OnFocus } from "../../shared/interfaces/events"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-autocomplete",
    template: `<dolfo-input-container>
        <div class="combobox autocomplete" [class.opened]="opened()" #autocomplete>
            <div class="combobox-label">
                <input #autocompleteInput type="text" [value]="currentOption()" (focus)="onFocus.emit($event); opened.set(true)" (blur)="onBlur.emit($event)" />
            </div>

            <div class="combobox-options" [class.opened]="opened()">
                @if(loading()){
                    <div class="loading">
                        {{ 'autocomplete.loading' | translate }}
                    </div>
                }
                @if(options().length === 0 && !loading()){
                    <div class="no-results">
                        {{ 'autocomplete.noResults' | translate }}
                    </div>
                }

                @for(opt of options(); track opt.value; let idx = $index){
                    <div class="combobox-option" [class.selected]="isSelected(opt)" [class.focused]="currentFocus() === idx" (click)="$event.stopPropagation(); setOption(opt)">
                        <span>{{ opt.label }}</span>
                    </div>
                }
            </div>
        </div>
    </dolfo-input-container>`,
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AutocompleteComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AutocompleteComponent), multi: true },
        { provide: BaseFormInput, useExisting: AutocompleteComponent }
    ]
})
export class AutocompleteComponent extends BaseFormInput<any> implements AfterViewInit, OnFocus, OnBlur{
    @ViewChild("autocomplete") autocomplete: ElementRef<HTMLDivElement>
    @ViewChild("autocompleteInput") autocompleteInput: ElementRef<HTMLInputElement>
    @Input({ required: true }) config: ComboboxConfig<any>
    @Input() minChars = 3
    @Output() onFocus = new EventEmitter<FocusEvent>()
    @Output() onBlur = new EventEmitter<FocusEvent>()

    public options = signal<ComboOption[]>([])
    public opened = signal(false)
    public currentOption = signal("")
    public currentOptionLabel = signal("")
    public loading = signal(false)
    public currentFocus = signal<number>(null)
    private keyDown = false
    private keyDownTimeout: NodeJS.Timeout

    constructor(){
        super()

        this.addSubscription(fromEvent(window, "click").pipe(
            filter(() => !!this.autocomplete),
            map(ev => ev.target as HTMLElement),
            map(target => !this.autocomplete.nativeElement.contains(target) && !target.isEqualNode(this.autocomplete.nativeElement))
        ).subscribe(condition => {
            if(condition && this.opened()){
                this.currentFocus.set(null)
                this.opened.set(false)
            }else if(!this.opened() && !condition)
                this.opened.set(true)
        }))

        this.addSubscription(this.input.valueChanges.pipe(
            filter(v => v != null && !!this.autocompleteInput && (this.autocompleteInput.nativeElement.value !== this.currentOptionLabel() || !this.currentOptionLabel()))
        ).subscribe(value => this.setOption({ value, label: this.config.getLabel(value) }, true)))
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit()

        this.addSubscription(fromEvent(this.autocompleteInput.nativeElement, "input").pipe(
            map(ev => (ev.target as HTMLInputElement).value),
            tap(value => {
                if(!value){
                    this.input.setValue(null)
                    this.onChange.emit(null)
                    this.options.set([])
                }
            }),
            delay(1000),
            filter(value => !this.keyDown && value.length >= this.minChars),
            tap(() => {
                this.options.set([])
                this.opened.set(true)
                this.loading.set(true)
            }),
            mergeMap(value => this.config.search$(value)),
            map(results => results.map(value => ({
                value,
                label: this.config.getLabel(value)
            })))
        ).subscribe(results => {
            this.loading.set(false)
            this.options.set(results)
            this.currentFocus.set(null)
        }))

        this.addSubscription(fromEvent<KeyboardEvent>(this.autocompleteInput.nativeElement, "keydown").subscribe(e => {
            if(e.key.length === 1){
                this.keyDown = true
                clearTimeout(this.keyDownTimeout)
                this.keyDownTimeout = setTimeout(() => this.keyDown = false, 1000)
            }else if(this.opened()){
                if(e.key === "ArrowDown"){
                    e.preventDefault()
                    this.currentFocus.update(v => v === this.options().length - 1 ? 0 : v === null ? 0 : v + 1)
                }else if(e.key === "ArrowUp"){
                    e.preventDefault()
                    this.currentFocus.update(v => v === 0 ? this.options().length - 1 : v === null ? 0 : v - 1)
                }else if(e.key === "Enter" && this.currentFocus() >= 0 && this.currentFocus() != null){
                    e.preventDefault()
                    this.setOption(this.options()[this.currentFocus()])
                }else if(e.key === "Tab"){
                    this.currentFocus.set(null)
                    this.opened.set(false)
                }
            }
        }))
    }

	public isSelected = (opt: ComboOption) => this.input.value === opt.value

    public setOption = (opt: ComboOption, noEmit = false) => {
        this.autocompleteInput.nativeElement.value = opt?.label
        this.currentOptionLabel.set(opt?.label)
        this.input.setValue(opt?.value)
        this.opened.set(false)

        if(!noEmit)
		    this.onChange.emit(this.input.value)
    }
}
