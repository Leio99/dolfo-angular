import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core"
import { DialogFooterButton } from "../../../shared/interfaces"

@Component({
    selector: "dolfo-dialog-footer",
    template: `<ng-template>
        @for(btn of buttons; track btn.label){
            <dolfo-button (onClick)="btn.onClick()" [color]="btn.color" [disabled]="btn.disabled" [loading]="btn.loading">
                @if(btn.icon && !btn.loading){
                    <dolfo-icon [name]="btn.icon"></dolfo-icon>
                }
                {{ btn.label }}
            </dolfo-button>
        }
    </ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DialogFooterComponent implements OnInit{
    @ViewChild(TemplateRef) template: TemplateRef<unknown>
    @Input({ required: true }) buttons: DialogFooterButton[]

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.cdr.detectChanges()
    }
}
