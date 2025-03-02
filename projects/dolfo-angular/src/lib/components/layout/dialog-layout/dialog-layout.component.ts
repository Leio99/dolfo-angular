import { ChangeDetectionStrategy, Component, ContentChild, Input } from "@angular/core"
import { DialogContentComponent } from "./dialog-content.component"
import { DialogFooterComponent } from "./dialog-footer.component"
import { DialogHeaderComponent } from "./dialog-header.component"

@Component({
    selector: "dolfo-dialog-layout",
    templateUrl: "./dialog-layout.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DialogLayoutComponent {
    @ContentChild(DialogHeaderComponent) header: DialogHeaderComponent
    @ContentChild(DialogContentComponent) content: DialogContentComponent
    @ContentChild(DialogFooterComponent) footer: DialogFooterComponent
    @Input() width: number
}
