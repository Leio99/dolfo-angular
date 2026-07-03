import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Directive, inject, OnDestroy, QueryList, ViewChild, ViewChildren } from "@angular/core"
import { FormArray, FormGroup, FormGroupDirective } from "@angular/forms"
import { BehaviorSubject, catchError, distinctUntilChanged, mergeMap, Observable, of, Subscription, tap } from "rxjs"
import { BaseFormInput } from "../../components/form/base-form-input"
import { NotificationService, TranslateService } from "../services"
import { Subscriptable } from "./subscriptable"

@Directive()
export abstract class Formable<T = object> extends Subscriptable implements OnDestroy, AfterViewInit, AfterViewChecked{
    @ViewChild(FormGroupDirective) formRef: FormGroupDirective
    @ViewChildren(BaseFormInput) inputs: QueryList<BaseFormInput<unknown>>

    public loading$ = new BehaviorSubject(false)
    protected notificationService = inject(NotificationService)
    protected translateService = inject(TranslateService)
    protected cdr = inject(ChangeDetectorRef)
    private subForm: Subscription
    
    protected abstract submit: (_formValue: T) => Observable<unknown>

    ngAfterViewInit() {
        if(!this.formRef)
            return
        
        this.addSubscription(this.loading$.pipe(
            distinctUntilChanged()
        ).subscribe(loading => {
            if(loading)
                this.formRef.form.disable()
            else
                this.formRef.form.enable()
        }))

        this.subForm = this.formRef.ngSubmit.pipe(
            tap(() => this.findInForm(this.formRef.form)),
            mergeMap(() => {
                if(!this.formRef.invalid && !this.loading$.getValue()){
                    this.loading$.next(true)
                    return this.submit(this.formRef.form.getRawValue()).pipe(
                        catchError(err => {
                            this.loading$.next(false)
                            return of(err)
                        }),
                        tap(() => this.loading$.next(false))
                    )
                }
                
                return of(null)
            })
        ).subscribe()

        this.addSubscription(this.subForm)

        this.addSubscription(this.translateService.getLang$().subscribe(() => this.cdr.detectChanges()))
    }
    
    ngAfterViewChecked() {
        if(!this.formRef && this.subForm){
            this.subForm.unsubscribe()
            this.subForm = null
        }else if(this.formRef && !this.subForm)
            this.ngAfterViewInit()
    }

    private findInForm = (formGroup: FormGroup, index?: number) => {
        for(const [key, control] of Object.entries(formGroup.controls)){
            control.markAsTouched()
            control.updateValueAndValidity()

            if(control.invalid){
                const arr = formGroup.get(key)

                if(arr instanceof FormArray){
                    let index = 0

                    for(const item of arr.controls){
                        if(this.findInForm(item as FormGroup, index))
                            return true

                        index++
                    }
                }else{
                    const inputs = this.inputs.toArray().filter(i => i.formControlName === key)

                    if(inputs.length === 1)
                        inputs[0].container?.focus()
                    else if(index != null)
                        inputs[index].container?.focus()

                    return true
                }
            }
        }

        return false
    }

    protected manualSubmit = () => this.formRef.ngSubmit.emit()
}
