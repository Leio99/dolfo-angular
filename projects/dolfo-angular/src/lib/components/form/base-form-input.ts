import { AfterViewInit, Directive, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core"
import { AbstractControl, ControlContainer, ControlValueAccessor, FormControl, ValidationErrors, Validator, Validators } from "@angular/forms"
import { filter } from "rxjs"
import { Subscriptable } from "../../shared/classes/subscriptable"
import { isDeepEqual } from "../../shared/interfaces"
import { InputContainerComponent } from "./input-container.component"

@Directive()
export abstract class BaseFormInput<T> extends Subscriptable implements ControlValueAccessor, Validator, AfterViewInit, OnInit {
    @ViewChild(InputContainerComponent) public container: InputContainerComponent
    @Input({ required: true }) formControlName: string
    @Input() label: string
    @Output() onChange: EventEmitter<T> = new EventEmitter<T>()

    private changeInternal: (obj: T) => void
    private cc = inject(ControlContainer)

    public input = new FormControl<T>(null)

    protected control: AbstractControl

    ngOnInit(){
        this.control = this.cc.control.get(this.formControlName)

        const initialValue = this.control.value

        this.addSubscription(this.input.valueChanges.pipe(
            filter(v => !this.control.touched && !isDeepEqual(initialValue, v))
        ).subscribe(v => {
            console.warn(initialValue, v)
            this.control.markAsTouched()
        }))

        this.addSubscription(this.control.statusChanges.pipe(
            filter(s => (s === "VALID" || s === "INVALID") && this.control.touched)
        ).subscribe(() => this.container.errors$.next(this.control.errors)))
    }

    ngAfterViewInit() {
        this.addSubscription(this.input.valueChanges.pipe(
            filter(() => !this.input.disabled)
        ).subscribe(v => {
            this.onChange.emit(v)
            this.changeInternal(v)
        }))
    }

    writeValue = (obj: T) => this.input.setValue(obj)

    registerOnChange = (fn: (obj: T) => void) => this.changeInternal = fn

    registerOnTouched = (_fn: (obj: any) => void) => {}

    setDisabledState = (isDisabled: boolean) => {
        if(isDisabled)
            this.input.disable()
        else
            this.input.enable()
    }

    validate = (_control: AbstractControl): ValidationErrors => null

    public get isRequired(){
        return this.control.hasValidator(Validators.required)
    }
}
