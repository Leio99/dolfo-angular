import { Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { OnBlur, OnFocus } from "../../shared/interfaces/events"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-input-time",
    template: `<dolfo-input-container>
        <input #formInput [name]="formControlName" [type]="'time'" [formControl]="input" (focus)="onFocus.emit($event)" (blur)="onBlur.emit($event)" />
        <ng-template></ng-template>
    </dolfo-input-container>`,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputTimeComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputTimeComponent), multi: true },
        { provide: BaseFormInput, useExisting: InputTimeComponent }
    ],
    standalone: false
})
export class InputTimeComponent extends BaseFormInput<string> implements OnFocus, OnBlur{
    @ViewChild("formInput") formInput: ElementRef<HTMLInputElement>
    @Output() onFocus = new EventEmitter<FocusEvent>()
    @Output() onBlur = new EventEmitter<FocusEvent>()

    public focus = () => this.formInput.nativeElement.focus()
}