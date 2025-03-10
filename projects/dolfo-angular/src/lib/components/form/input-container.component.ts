import { Component, ElementRef } from "@angular/core"
import { ValidationErrors } from "@angular/forms"
import { BehaviorSubject, distinctUntilChanged, map, Observable } from "rxjs"
import { isDeepEqual } from "../../shared/interfaces"
import { BaseFormInput } from "./base-form-input"

@Component({
    selector: "dolfo-input-container",
    template: `<div class="input-container" [class.error]="decodedError$ | async">
        @if(input.label){
            <label>
                {{ input.label }}
                @if(input.isRequired){
                    <span [dolfoTooltip]="'form.required' | translate">*</span>
                }
            </label>
        }

        <ng-content></ng-content>

        @let error = decodedError$ | async;

        @if(error){
            <div class="input-errors">
                {{ error[0] | translate: error[1] }}
            </div>
        }
    </div>`,
    standalone: false
})
export class InputContainerComponent{
    public errors$ = new BehaviorSubject<ValidationErrors>(null)
    public decodedError$: Observable<[string, Record<string, string>?]> = this.errors$.pipe(
        distinctUntilChanged((a, b) => isDeepEqual(a, b)),
        map(val => {
            if(val){
                if(val.required)
                    return ["form.requiredError"]
                if(val.email)
                    return ["form.invalidEmail"]
                if(val.maxlength)
                    return [`form.maxChars`, { length: val.maxlength.requiredLength }]
                if(val.minlength)
                    return [`form.minChars`, { length: val.minlength.requiredLength }]
                if(val.password)
                    return ["form.invalidPassword"]

                return ["form.errorGeneric"]
            }
    
            return null
        })
    )

    constructor(public input: BaseFormInput<unknown>, private elRef: ElementRef<HTMLDivElement>){}

    public focus = () => {
        const input = this.elRef.nativeElement.querySelector("input")

        if(input)
            input.focus()
    }
}
