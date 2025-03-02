import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { DirectivesModule } from "../../../shared/directives/directives.module"
import { TranslatePipe } from "../../../shared/pipes/translate.pipe"
import { LayoutModule } from "../layout.module"
import { GridComponent } from "./grid.component"

@NgModule({
    declarations: [GridComponent],
    imports: [CommonModule, DirectivesModule, LayoutModule, TranslatePipe],
    exports: [GridComponent]
})
export class GridModule{}