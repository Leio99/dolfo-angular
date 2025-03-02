import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { DirectivesModule } from "../../shared/directives/directives.module"
import { TranslatePipe } from "../../shared/pipes/translate.pipe"
import { ComboboxComponent } from "./combobox.component"
import { DatepickerComponent } from "./datepicker.component"
import { InputContainerComponent } from "./input-container.component"
import { InputTextComponent } from "./input-text.component"

@NgModule({
    declarations: [InputTextComponent, InputContainerComponent, ComboboxComponent, DatepickerComponent],
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe, DirectivesModule],
    exports: [InputTextComponent, InputContainerComponent, ComboboxComponent, DatepickerComponent, ReactiveFormsModule]
})
export class FormModule {}
