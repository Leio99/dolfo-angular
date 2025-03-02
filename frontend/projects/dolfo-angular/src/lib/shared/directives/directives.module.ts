import { NgModule } from "@angular/core"
import { ContextMenuDirective } from "./context-menu.directive"
import { ScrollDragDirective } from "./scroll-drag.directive"
import { TooltipDirective } from "./tooltip.directive"

@NgModule({
    declarations: [ContextMenuDirective, ScrollDragDirective, TooltipDirective],
    exports: [ContextMenuDirective, ScrollDragDirective, TooltipDirective]
})
export class DirectivesModule{}