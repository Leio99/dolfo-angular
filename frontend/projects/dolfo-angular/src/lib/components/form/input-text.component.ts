import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { InputType } from "../../shared/interfaces"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-input-text",
    template: `<dolfo-input-container>
        @if(type === "textarea"){
            <textarea #formInput [name]="formControlName" [formControl]="input" (focus)="onFocus.emit()" (blur)="onBlur.emit()" [placeholder]="placeHolder"></textarea>
        }@else{
            <input #formInput [name]="formControlName" [type]="type" [formControl]="input" (focus)="onFocus.emit()" (blur)="onBlur.emit()" [placeholder]="placeHolder" />
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
export class InputTextComponent extends BaseFormInput<string> {
    @Input() type: InputType = "text"
    @Input() placeHolder = ""
    @Output() onFocus = new EventEmitter()
    @Output() onBlur = new EventEmitter()
    @ViewChild("formInput") formInput: ElementRef<HTMLInputElement | HTMLTextAreaElement>

    public focus = () => this.formInput.nativeElement.focus()
}
