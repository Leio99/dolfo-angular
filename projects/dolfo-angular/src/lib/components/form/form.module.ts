import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { DirectivesModule } from "../../shared/directives/directives.module"
import { TranslatePipe } from "../../shared/pipes/translate.pipe"
import { AutocompleteComponent } from "./autocomplete.component"
import { ComboboxComponent } from "./combobox.component"
import { DatepickerComponent } from "./datepicker.component"
import { InputContainerComponent } from "./input-container.component"
import { InputRadioComponent } from "./input-radio.component"
import { InputTextComponent } from "./input-text.component"
import { InputTimeComponent } from "./input-time.component"

@NgModule({
    declarations: [InputTextComponent, InputContainerComponent, ComboboxComponent, DatepickerComponent, AutocompleteComponent, InputTimeComponent, InputRadioComponent],
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe, DirectivesModule],
    exports: [ReactiveFormsModule, InputTextComponent, InputContainerComponent, ComboboxComponent, DatepickerComponent, AutocompleteComponent, InputTimeComponent, InputRadioComponent]
})
export class FormModule {}
