import { AfterViewInit, ChangeDetectorRef, Directive, inject, OnDestroy, QueryList, ViewChild, ViewChildren } from "@angular/core"
import { FormGroupDirective } from "@angular/forms"
import { BehaviorSubject, catchError, distinctUntilChanged, mergeMap, Observable, of, tap } from "rxjs"
import { BaseFormInput } from "../../components/form/base-form-input"
import { NotificationService, TranslateService } from "../services"
import { Subscriptable } from "./subscriptable"

@Directive()
export abstract class Formable<T = object> extends Subscriptable implements OnDestroy, AfterViewInit{
    @ViewChild(FormGroupDirective) formRef: FormGroupDirective
    @ViewChildren(BaseFormInput) inputs: QueryList<BaseFormInput<unknown>>

    public loading$ = new BehaviorSubject(false)
    protected notificationService = inject(NotificationService)
    protected translateService = inject(TranslateService)
    private cdr = inject(ChangeDetectorRef)
    
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

        this.addSubscription(this.formRef.ngSubmit.pipe(
            tap(() => {
                let focused = false
                
                Object.entries(this.formRef.form.controls).forEach(([key, control]) => {
                    control.markAsTouched()
                    control.updateValueAndValidity()

                    if(!control.valid && !focused){
                        this.inputs.toArray().find(i => i.formControlName === key).container.focus()
                        focused = true
                    }
                })
            }),
            mergeMap(() => {
                if(this.formRef.valid && !this.loading$.getValue()){
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
        ).subscribe())

        this.addSubscription(this.translateService.getLang$().subscribe(() => this.cdr.detectChanges()))
    }

    protected manualSubmit = () => this.formRef.ngSubmit.emit()
}
