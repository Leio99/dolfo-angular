import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core"
import { FormGroup } from "@angular/forms"
import { DomSanitizer } from "@angular/platform-browser"
import { Observable, of } from "rxjs"
import { Formable } from "../../../shared/classes"
import { DialogActionType, DialogComponentInput, DialogFooterButton, DialogForm, DialogIcon, DialogType, IDialogInput } from "../../../shared/interfaces"
import { DialogService } from "../../../shared/services"

@Component({
    selector: "dolfo-dialog",
    standalone: false,
    template: `<dolfo-dialog-layout [width]="width">
        @if(title){
            <dolfo-dialog-header [title]="title" [showCloseX]="showCloseX()" [icon]="getIcon()"></dolfo-dialog-header>
        }

        <dolfo-dialog-content>
            <div [class.loading]="type === 'loading'">
                @if(message){
                    <span [innerHTML]="sanitizeMsg()"></span>
                }

                @if(form && formGroup){
                    <form [formGroup]="formGroup">
                        @for(f of form; track f.name){
                            @switch(f.type){
                                @case("date"){
                                    <dolfo-datepicker [formControlName]="f.name" [label]="f.label"></dolfo-datepicker>
                                }
                                @case("autocomplete"){
                                    <dolfo-autocomplete [formControlName]="f.name" [label]="f.label" [config]="f.autocompleteCfg"></dolfo-autocomplete>
                                }
                                @case("radio"){
                                    <dolfo-input-radio [formControlName]="f.name" [label]="f.label" [options]="f.options"></dolfo-input-radio>
                                }
                                @case("combobox"){
                                    <dolfo-combobox [formControlName]="f.name" [label]="f.label" [options]="f.options"></dolfo-combobox>
                                }
                                @default{
                                    <dolfo-input-text [formControlName]="f.name" [type]="f.type" [label]="f.label"></dolfo-input-text>
                                }
                            }
                        }
                    </form>
                }
            </div>
        </dolfo-dialog-content>

        @let footer = buttons || getFooter();

        @if(footer){
            <dolfo-dialog-footer [buttons]="footer"></dolfo-dialog-footer>
        }
    </dolfo-dialog-layout>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent extends Formable implements Required<IDialogInput>, OnInit {
    @Input() title: string
    @Input({ required: true }) message: string
    @Input() type: DialogType = "info"
    @Input() width: number
    @Input() hideCloseX = false
    @Input() form: DialogForm
    @Input() component: DialogComponentInput
    @Input() buttons: DialogFooterButton[]
    public formGroup: FormGroup
    
    protected dialogService = inject(DialogService)
    private sanitizer = inject(DomSanitizer)

    ngOnInit() {
        if(this.form){
            this.formGroup = new FormGroup({})
            this.form.forEach(f => this.formGroup.addControl(f.name, f.control))
        }
    }

    protected submit = (): Observable<unknown> => of(null)

    public getIcon = (): DialogIcon => {
        if(this.type === "info")
            return { icon: "info", color: "info" }
        if(this.type === "error")
            return { icon: "notification", color: "error" }
        if(this.type === "confirm")
            return { icon: "question", color: "warning" }

        return null
    }

    protected close = (type: DialogActionType, data?: Record<string, any>) => {
        if(type === DialogActionType.OK && this.formGroup && this.formRef){
            this.formRef.ngSubmit.emit()

            if(this.formGroup.invalid)
                return
        }

        this.dialogService.action({ type, data: data != null ? data : this.formGroup?.getRawValue() })
        this.dialogService.close()
    }

    public showCloseX = () => this.type !== "loading" && !this.hideCloseX

    public getFooter = (): DialogFooterButton[] => {
        if(this.type === "loading")
            return null

        if(this.type === "info" || this.type === "error"){
            return [{
                label: this.translateService.translate("dialog.ok"),
                onClick: () => this.close(DialogActionType.OK),
                color: this.type
            }]
        }

        return [{
            label: this.translateService.translate("dialog.confirm"),
            onClick: () => this.close(DialogActionType.OK),
            color: "primary"
        },
        {
            label: this.translateService.translate("dialog.no"),
            onClick: () => this.close(DialogActionType.NO),
            color: "secondary"
        }]
    }

    public sanitizeMsg = () => this.sanitizer.bypassSecurityTrustHtml(this.message)
}
