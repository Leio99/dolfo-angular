import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core"

@Component({
    selector: "dolfo-dialog-content",
    template: `<ng-template><ng-content></ng-content></ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DialogContentComponent implements OnInit{
    @ViewChild(TemplateRef) template: TemplateRef<unknown>
    private cdr = inject(ChangeDetectorRef)

    ngOnInit() {
        this.cdr.detectChanges()
    }
}
