import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core"
import { DialogActionType, DialogIcon } from "../../../shared/interfaces"
import { DialogService } from "../../../shared/services"

@Component({
    selector: "dolfo-dialog-header",
    template: `<ng-template>
        <h5>
            @if(icon){
                <i [class]="'icon-' + icon.icon + ' fg-' + icon.color"></i>
            }
            {{ title }}
        </h5>
        @if(showCloseX){
            <dolfo-button (click)="close()" color="secondary" [dolfoTooltip]="'dialog.close' | translate">
                <i class="icon-cross"></i>
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

    constructor(private cdr: ChangeDetectorRef, private dialogService: DialogService) {}

    ngOnInit() {
        this.cdr.detectChanges()
    }

    public close = () => {
        this.dialogService.action({ type: DialogActionType.CANCEL, data: null })
        this.dialogService.close()
    }
}
