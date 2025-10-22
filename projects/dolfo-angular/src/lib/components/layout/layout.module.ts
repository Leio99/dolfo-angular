import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { DirectivesModule } from "../../shared/directives/directives.module"
import { TranslatePipe } from "../../shared/pipes/translate.pipe"
import { ButtonComponent } from "./button.component"
import { ContextMenuComponent } from "./context-menu.component"
import { IconWrapperComponent } from "./icon-wrapper.component"
import { IconComponent } from "./icon.component"
import { LoaderComponent } from "./loader.component"
import { NotificationComponent } from "./notification.component"
import { PopoverComponent } from "./popover.component"
import { TooltipComponent } from "./tooltip.component"

@NgModule({
    declarations: [ButtonComponent, ContextMenuComponent, IconWrapperComponent, LoaderComponent, NotificationComponent, TooltipComponent, IconComponent, PopoverComponent],
    imports: [CommonModule, DirectivesModule, TranslatePipe],
    exports: [ButtonComponent, ContextMenuComponent, IconWrapperComponent, LoaderComponent, NotificationComponent, TooltipComponent, IconComponent, PopoverComponent]
})
export class LayoutModule {}