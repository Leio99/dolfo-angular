import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core"
import { DialogActionType, DialogIcon } from "../../../shared/interfaces"
import { DialogService } from "../../../shared/services"

@Component({
    selector: "dolfo-dialog-header",
    template: `<ng-template>
        <h5>
            @if(icon){
                <dolfo-icon [name]="getIcon()" [class]="'fg-' + icon.color"></dolfo-icon>
            }
            {{ title }}
        </h5>
        @if(showCloseX){
            <dolfo-button (click)="close()" color="secondary" [dolfoTooltip]="'dialog.close' | translate">
                <dolfo-icon name="cross"></dolfo-icon>
            </dolfo-button>
        }
    </ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DialogHeaderComponent implements OnInit{
    @ViewChild(TemplateRef) template: TemplateRef<unknown>
    @Input({ required: true }) title: string
    @Input() icon: DialogIcon
    @Input({ transform: booleanAttribute }) showCloseX = true
    @Output() onCancel = new EventEmitter()
    private cdr = inject(ChangeDetectorRef)
    private dialogService = inject(DialogService)

    ngOnInit() {
        this.cdr.detectChanges()
    }

    public close = () => {
        if(this.onCancel.observed)
            this.onCancel.emit()
        else{
            this.dialogService.action({ type: DialogActionType.CANCEL, data: null })
            this.dialogService.close()
        }
    }

    public getIcon = () => this.icon.icon
}
