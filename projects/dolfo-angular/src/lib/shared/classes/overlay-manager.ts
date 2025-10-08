import { ComponentRef, createComponent, EnvironmentInjector, Injector, ViewContainerRef } from "@angular/core"
import { distinctUntilChanged, filter, map, tap } from "rxjs"
import { CONTEXT_MENU_DESTROY_TOKEN, ContextMenuComponent } from "../../components/layout/context-menu.component"
import { DialogComponent } from "../../components/layout/dialog-layout/dialog.component"
import { NotificationComponent } from "../../components/layout/notification.component"
import { TOOLTIP_DESTROY_TOKEN, TooltipComponent } from "../../components/layout/tooltip.component"
import { IDialogInput, isDeepEqual } from "../interfaces"
import { ContextMenuService, DialogService, NotificationService, TooltipService } from "../services"

export class OverlayManager{
    private dialog: [ComponentRef<IDialogInput>, number][] = []
    private notification: ComponentRef<NotificationComponent>
    private tooltip: ComponentRef<TooltipComponent>
    private contextMenu: ComponentRef<ContextMenuComponent>
    
    constructor(private injector: Injector, private container: ViewContainerRef){}

    public init = () => {
        const ds = this.injector.get(DialogService),
        ns = this.injector.get(NotificationService),
        ts = this.injector.get(TooltipService),
        cs = this.injector.get(ContextMenuService),
        environmentInjector = this.injector.get(EnvironmentInjector)

        return [
            ds.getDialog$().pipe(
                tap(inputs => {
                    const notFound = this.dialog.filter(d => !inputs.some(i => i._dialogId === d[1]))

                    notFound.forEach(d => d[0].destroy())

                    this.dialog = this.dialog.filter(d => !notFound.some(d2 => d2[1] === d[1]))
                }),
                map(inputs => inputs[inputs.length - 1]),
                distinctUntilChanged((a, b) => isDeepEqual(a, b)),
                filter(input => !!input && !this.dialog.some(d => d[1] === input._dialogId))
            ).subscribe(input => {
                const dialog = createComponent(input.component?.type || DialogComponent, { environmentInjector })
                this.dialog.push([dialog, input._dialogId])
                
                Object.entries(input).filter(k => k[0] !== "_dialogId").forEach(([k, v]) => dialog.setInput(k, v))
                
                if(input.component?.input)
                    Object.entries(input.component.input).forEach(([k, v]) => dialog.setInput(k, v))
    
                this.container.insert(dialog.hostView)
            }),
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
    
                this.container.insert(this.notification.hostView)
            }),
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
    
                this.container.insert(this.tooltip.hostView)
            }),
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
    
                this.container.insert(this.contextMenu.hostView)
            })
        ]
    }
}