import { ChangeDetectionStrategy, Component, Input } from "@angular/core"

@Component({
	selector: "dolfo-loader",
	standalone: false,
	template: `<div class="loading">
		<dolfo-icon name="spinner5"></dolfo-icon>
		{{ langKey | translate }}
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
	@Input() langKey = "loading"
}
