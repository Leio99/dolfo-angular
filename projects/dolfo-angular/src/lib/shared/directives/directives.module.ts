import { NgModule } from "@angular/core"
import { ContextMenuDirective } from "./context-menu.directive"
import { PopoverDirective } from "./popover.directive"
import { ScrollDragDirective } from "./scroll-drag.directive"
import { TooltipDirective } from "./tooltip.directive"

@NgModule({
    declarations: [ContextMenuDirective, ScrollDragDirective, TooltipDirective, PopoverDirective],
    exports: [ContextMenuDirective, ScrollDragDirective, TooltipDirective, PopoverDirective]
})
export class DirectivesModule{}