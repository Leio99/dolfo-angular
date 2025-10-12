import { ChangeDetectionStrategy, Component, Input } from "@angular/core"
import { IconName } from "../../shared/interfaces"

@Component({
    selector: "dolfo-icon-x",
    standalone: false,
    template: `<i [class]="'icon-' + name"></i>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
    @Input({ required: true }) name: IconName
}
