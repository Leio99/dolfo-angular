import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { InputType } from "../../shared/interfaces"
import { OnBlur, OnFocus } from "../../shared/interfaces/events"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-input-text",
    template: `<dolfo-input-container>
        @if(type === "textarea"){
            <textarea #formInput [name]="formControlName" [formControl]="input" (focus)="onFocus.emit($event)" (blur)="onBlur.emit($event)" [placeholder]="placeHolder"></textarea>
        }@else{
            <input #formInput [name]="formControlName" [type]="type" [formControl]="input" (focus)="onFocus.emit($event)" (blur)="onBlur.emit($event)" [placeholder]="placeHolder" />
        }
        <ng-template></ng-template>
    </dolfo-input-container>`,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputTextComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputTextComponent), multi: true },
        { provide: BaseFormInput, useExisting: InputTextComponent }
    ],
    standalone: false
})
export class InputTextComponent extends BaseFormInput<string> implements OnFocus, OnBlur{
    @Input() type: InputType = "text"
    @Input() placeHolder = ""
    @Output() onFocus = new EventEmitter<FocusEvent>()
    @Output() onBlur = new EventEmitter<FocusEvent>()
    @ViewChild("formInput") formInput: ElementRef<HTMLInputElement | HTMLTextAreaElement>

    public focus = () => this.formInput.nativeElement.focus()
}
