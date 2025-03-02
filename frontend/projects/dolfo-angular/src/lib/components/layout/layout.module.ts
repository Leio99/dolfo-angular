import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { DirectivesModule } from "../../shared/directives/directives.module"
import { TranslatePipe } from "../../shared/pipes/translate.pipe"
import { ButtonComponent } from "./button.component"
import { ContextMenuComponent } from "./context-menu.component"
import { IconComponent } from "./icon.component"
import { LoaderComponent } from "./loader.component"
import { NotificationComponent } from "./notification.component"
import { TooltipComponent } from "./tooltip.component"

@NgModule({
    declarations: [ButtonComponent, ContextMenuComponent, IconComponent, LoaderComponent, NotificationComponent, TooltipComponent],
    imports: [CommonModule, DirectivesModule, TranslatePipe],
    exports: [ButtonComponent, ContextMenuComponent, IconComponent, LoaderComponent, NotificationComponent, TooltipComponent]
})
export class LayoutModule {}