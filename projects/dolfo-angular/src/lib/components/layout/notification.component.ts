import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core"
import { INotificationInput, NotificationAction, NotificationType } from "../../shared/interfaces"
import { NotificationService, TranslateService } from "../../shared/services"

@Component({
    selector: "dolfo-notification",
    standalone: false,
    template: `<div class="notification" [ngClass]="{
        success: type === 'success',
        error: type === 'error',
        warning: type === 'warning',
        info: type === 'info'
    }" (mouseenter)="mouseEnter()" (mouseleave)="mouseLeave()" (click)="click()">
        <div class="notification-header">
            <h6>{{ title || getTitleByType() }}</h6>
        </div>
        <div class="notification-content">
            {{ message }}
        </div>
        @if(action){
            <div class="notification-action">
                <dolfo-button [color]="type" (onClick)="action.click()">
                    <dolfo-icon name="new-tab"></dolfo-icon>
                    {{ action.label }}
                </dolfo-button>
            </div>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit, Required<INotificationInput>{
    @Input({ required: true }) title: string
    @Input({ required: true }) message: string
    @Input() type: NotificationType = "info"
    @Input() action: NotificationAction

    private timeout: any

    constructor(private ns: NotificationService, private ts: TranslateService){}

    ngOnInit(){
        this.mouseLeave()
    }

    public mouseEnter = () => clearTimeout(this.timeout)

    public mouseLeave = () => this.timeout = setTimeout(() => this.ns.hide(), 3000)

    public click = () => {
        this.mouseEnter()
        this.ns.hide()
    }

    public getTitleByType = () => this.ts.translate("notification." + this.type)
}
