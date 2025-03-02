import { ChangeDetectionStrategy, Component, Input } from "@angular/core"

@Component({
  selector: "dolfo-icon",
  standalone: false,
  template: `<i [class]="'icon-' + name"></i>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input({ required: true }) name: string
}
