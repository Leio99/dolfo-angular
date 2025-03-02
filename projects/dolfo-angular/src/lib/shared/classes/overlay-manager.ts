import { ComponentRef, createComponent, EnvironmentInjector, Injector, ViewContainerRef } from "@angular/core"
import { distinctUntilChanged, filter, tap } from "rxjs"
import { CONTEXT_MENU_DESTROY_TOKEN, ContextMenuComponent } from "../../components/layout/context-menu.component"
import { DialogComponent } from "../../components/layout/dialog-layout/dialog.component"
import { NotificationComponent } from "../../components/layout/notification.component"
import { TOOLTIP_DESTROY_TOKEN, TooltipComponent } from "../../components/layout/tooltip.component"
import { IDialogInput, isDeepEqual } from "../interfaces"
import { ContextMenuService, DialogService, NotificationService, TooltipService } from "../services"

export class OverlayManager{
    private dialog: ComponentRef<IDialogInput>
    private notification: ComponentRef<NotificationComponent>
    private tooltip: ComponentRef<TooltipComponent>
    private contextMenu: ComponentRef<ContextMenuComponent>
    
    constructor(injector: Injector, container: ViewContainerRef){
        const ds = injector.get(DialogService),
        ns = injector.get(NotificationService),
        ts = injector.get(TooltipService),
        cs = injector.get(ContextMenuService),
        environmentInjector = injector.get(EnvironmentInjector)

        ds.getDialog$().pipe(
            distinctUntilChanged((a, b) => isDeepEqual(a, b)),
            tap(() => {
                if(this.dialog)
                    this.dialog.destroy()
            }),
            filter(input => !!input)
        ).subscribe(input => {
            this.dialog = createComponent(input.component?.type || DialogComponent, { environmentInjector })
            
            Object.entries(input).forEach(([k, v]) => this.dialog.setInput(k, v))
            
            if(input.component?.input)
                Object.entries(input.component.input).forEach(([k, v]) => this.dialog.setInput(k, v))

            container.insert(this.dialog.hostView)
        })
        
        ns.getNotification$().pipe(
            distinctUntilChanged((a, b) => isDeepEqual(a, b)),
            tap(() => {
                if(this.notification)
                    this.notification.destroy()
            }),
            filter(input => !!input)
        ).subscribe(input => {
            this.notification = createComponent(NotificationComponent, { environmentInjector })
            
            Object.entries(input).forEach(([k, v]) => this.notification.setInput(k, v))

            container.insert(this.notification.hostView)
        })

        ts.getTooltip$().pipe(
            tap(() => {
                if(this.tooltip)
                    this.tooltip.destroy()
            }),
            filter(input => !!input)
        ).subscribe(input => {
            this.tooltip = createComponent(TooltipComponent, {
                environmentInjector,
                elementInjector: Injector.create({
                    providers: [{ provide: TOOLTIP_DESTROY_TOKEN, useValue: () => this.tooltip.destroy() }]
                })
            })

            Object.entries(input).forEach(([k, v]) => this.tooltip.setInput(k, v))

            container.insert(this.tooltip.hostView)
        })

        cs.getContextMenu$().pipe(
            distinctUntilChanged((a, b) => isDeepEqual(a, b)),
            tap(() => {
                if(this.contextMenu)
                    this.contextMenu.destroy()
            }),
            filter(input => !!input)
        ).subscribe(input => {
            this.contextMenu = createComponent(ContextMenuComponent, {
                environmentInjector,
                elementInjector: Injector.create({
                    providers: [{ provide: CONTEXT_MENU_DESTROY_TOKEN, useValue: () => this.contextMenu.destroy() }]
                })
            })

            Object.entries(input).forEach(([k, v]) => this.contextMenu.setInput(k, v))

            container.insert(this.contextMenu.hostView)
        })
    }
}