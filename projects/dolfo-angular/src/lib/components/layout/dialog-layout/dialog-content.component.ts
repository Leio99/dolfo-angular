import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from "@angular/core"

@Component({
    selector: "dolfo-dialog-content",
    template: `<ng-template><ng-content></ng-content></ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DialogContentComponent implements OnInit{
    @ViewChild(TemplateRef) template: TemplateRef<unknown>

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.cdr.detectChanges()
    }
}
