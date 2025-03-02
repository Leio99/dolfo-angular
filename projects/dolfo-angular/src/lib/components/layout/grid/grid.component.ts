import { Component, Input } from "@angular/core"
import { ColumnDataType, GridColumn, GridConfig } from "../../../shared/interfaces"
import { TranslateService } from "../../../shared/services"

@Component({
  selector: "dolfo-grid",
  templateUrl: "./grid.component.html",
  standalone: false
})
export class GridComponent<T>{
	@Input({ required: true }) config: GridConfig<T>

	constructor(private translateService: TranslateService){}

	public resolveField = (item: T, { field, formatter, dataType }: GridColumn) => {
        let value = field
            .toString()
            .split(".")
            .reduce((prev, curr) => prev?.[curr as keyof T] as any, item) as string

        if(dataType === ColumnDataType.DATE)
			value = this.translateService.formatDate(value)
        else if(dataType === ColumnDataType.DATETIME)
			value = this.translateService.formatDateTime(value)

        return formatter ? formatter(value) : value
    }
}
