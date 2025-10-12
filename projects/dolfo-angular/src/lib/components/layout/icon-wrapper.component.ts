import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core"
import { ICON_COMPONENT, IconName } from "../../shared/interfaces"

@Component({
    selector: "dolfo-icon",
    standalone: false,
    template: `<ng-container [ngComponentOutlet]="iconComponent" [ngComponentOutletInputs]="{ name }"></ng-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconWrapperComponent {
    @Input({ required: true }) name: IconName

    public iconComponent = inject(ICON_COMPONENT)
}
