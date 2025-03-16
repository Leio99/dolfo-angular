import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, signal, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { delay, filter, fromEvent, map, mergeMap, Observable, tap } from "rxjs"
import { ComboOption } from "../../shared/interfaces"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-autocomplete",
    template: `<dolfo-input-container>
        <div class="combobox autocomplete" [class.opened]="opened()" #autocomplete>
            <div class="combobox-label">
                <input type="text" [value]="currentOption()" #autocompleteInput />
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

                @for(opt of options(); track opt.value){
                    <div class="combobox-option" [class.selected]="isSelected(opt)" (click)="$event.stopPropagation(); setOption(opt)">
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
export class AutocompleteComponent extends BaseFormInput<any> implements AfterViewInit{
    @ViewChild("autocomplete") autocomplete: ElementRef<HTMLDivElement>
    @ViewChild("autocompleteInput") autocompleteInput: ElementRef<HTMLInputElement>
    @Input({ required: true }) search$: (filter: string) => Observable<ComboOption[]>
    @Input() minChars = 3

    public options = signal<ComboOption[]>([])
    public opened = signal(false)
    public currentOption = signal("")
    public loading = signal(false)
    private keyDown = false
    private keyDownTimeout: NodeJS.Timeout

    constructor(){
        super()

        this.addSubscription(fromEvent(window, "click").pipe(
            map(ev => ev.target as HTMLElement),
            map(target => !this.autocomplete.nativeElement.contains(target) && !target.isEqualNode(this.autocomplete.nativeElement))
        ).subscribe(condition => {
            if(condition && this.opened())
                this.opened.set(false)
            else if(!this.opened() && !condition)
                this.opened.set(true)
        }))
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
            mergeMap(value => this.search$(value))
        ).subscribe(results => {
            this.loading.set(false)
            this.options.set(results)
        }))

        this.addSubscription(fromEvent(this.autocompleteInput.nativeElement, "keydown").subscribe(() => {
            this.keyDown = true
            clearTimeout(this.keyDownTimeout)
            this.keyDownTimeout = setTimeout(() => this.keyDown = false, 1000)
        }))
    }

	public isSelected = (opt: ComboOption) => this.input.value === opt.value

    public setOption = (opt: ComboOption) => {
        this.autocompleteInput.nativeElement.value = opt?.label
        this.input.setValue(opt?.value)
        this.opened.set(false)
		this.onChange.emit(this.input.value)
    }
}
