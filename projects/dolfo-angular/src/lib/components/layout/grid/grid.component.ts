import { Component, Input } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"
import { ColumnDataType, GridColumn, GridConfig } from "../../../shared/interfaces"
import { TranslateService } from "../../../shared/services"

@Component({
  selector: "dolfo-grid",
  templateUrl: "./grid.component.html",
  standalone: false
})
export class GridComponent<T>{
	@Input({ required: true }) config: GridConfig<T>

	constructor(private translateService: TranslateService, private sanitizer: DomSanitizer){}

	public resolveField = (item: T, { field, formatter, dataType }: GridColumn) => {
        let value = field
            .toString()
            .split(".")
            .reduce((prev, curr) => prev?.[curr as keyof T] as any, item) as string

        if(dataType === ColumnDataType.DATE)
			value = this.translateService.formatDate(value)
        else if(dataType === ColumnDataType.DATETIME)
			value = this.translateService.formatDateTime(value)

        const retValue = formatter ? formatter(value) : value
        
        return this.sanitizer.bypassSecurityTrustHtml(retValue)
    }
}
