import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { DirectivesModule } from "../../../shared/directives/directives.module"
import { TranslatePipe } from "../../../shared/pipes/translate.pipe"
import { FormModule } from "../../form/form.module"
import { LayoutModule } from "../layout.module"
import { DialogContentComponent } from "./dialog-content.component"
import { DialogFooterComponent } from "./dialog-footer.component"
import { DialogHeaderComponent } from "./dialog-header.component"
import { DialogLayoutComponent } from "./dialog-layout.component"
import { DialogComponent } from "./dialog.component"

@NgModule({
    declarations: [DialogComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogLayoutComponent],
    imports: [CommonModule, DirectivesModule, LayoutModule, ReactiveFormsModule, TranslatePipe, FormModule],
    exports: [DialogComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogLayoutComponent]
})
export class DialogLayoutModule {}
