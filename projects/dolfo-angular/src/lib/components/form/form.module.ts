import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { DirectivesModule } from "../../shared/directives/directives.module"
import { TranslatePipe } from "../../shared/pipes/translate.pipe"
import { LayoutModule } from "../layout/layout.module"
import { AutocompleteComponent } from "./autocomplete.component"
import { ComboboxComponent } from "./combobox.component"
import { DatepickerComponent } from "./datepicker.component"
import { InputCheckboxComponent } from "./input-checkbox.component"
import { InputContainerComponent } from "./input-container.component"
import { InputRadioComponent } from "./input-radio.component"
import { InputTextComponent } from "./input-text.component"

@NgModule({
    declarations: [InputTextComponent, InputContainerComponent, ComboboxComponent, DatepickerComponent, AutocompleteComponent, InputRadioComponent, InputCheckboxComponent],
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe, DirectivesModule, LayoutModule],
    exports: [ReactiveFormsModule, InputTextComponent, InputContainerComponent, ComboboxComponent, DatepickerComponent, AutocompleteComponent, InputRadioComponent, InputCheckboxComponent]
})
export class FormModule {}
