import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Injector, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core"
import { DialogFooterButton } from "../../../shared/interfaces"
import { ButtonComponent } from "../button.component"

@Component({
    selector: "dolfo-dialog-footer",
    template: `<ng-template>
        @for(btn of buttons; track btn.label){
            <dolfo-button (onClick)="btn.onClick(null)" [color]="btn.color" [disabled]="btn.disabled" [loading]="btn.loading">
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
export class DialogFooterComponent implements OnInit, AfterViewChecked{
    @ViewChild(TemplateRef) template: TemplateRef<unknown>
    @ViewChildren(ButtonComponent) childrenButtons: QueryList<ButtonComponent>
    @Input({ required: true }) buttons: DialogFooterButton[]

    private focused = false
    private cdr = inject(ChangeDetectorRef)
    private injector = inject(Injector)

    async ngOnInit() {
        this.cdr.detectChanges()
        setTimeout(() => this.cdr.markForCheck())
        const { DialogComponent } = await import("./dialog.component"),
        parent = this.injector.get(DialogComponent, null)

        console.log("PArent", parent)
    }

    ngAfterViewChecked(): void {
        if(!this.focused){
            const firstBtn = this.childrenButtons.find(btn => !btn.disabled && !btn.loading)

            if(firstBtn)
                firstBtn.focus()
            
            this.focused = true
        }
    }
}
