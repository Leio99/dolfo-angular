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

	public resolveField = (item: T, { field, formatter, dataType, onLink }: GridColumn) => {
        let value = field
            .toString()
            .split(".")
            .reduce((prev, curr) => prev?.[curr as keyof T] as any, item) as string

        if(dataType === ColumnDataType.DATE)
			value = this.translateService.formatDate(value)
        else if(dataType === ColumnDataType.DATETIME)
			value = this.translateService.formatDateTime(value)

        let retValue = formatter ? formatter(value) : value

		if(dataType === ColumnDataType.LINK)
			retValue = `<a href="javascript:void(0)">${retValue}</a>`
        
        return this.sanitizer.bypassSecurityTrustHtml(retValue)
    }

	public checkLink = (e: Event, col: GridColumn, item: T, cell: HTMLTableCellElement) => {
		if(col.dataType !== ColumnDataType.LINK || !col.onLink)
			return

		const colValue = col.field
            .toString()
            .split(".")
            .reduce((prev, curr) => prev?.[curr as keyof T] as any, item),
		htmlTarget = e.target as HTMLElement

		if(htmlTarget.tagName.toLowerCase() === "a")
			col.onLink(colValue)
		else{
			const a = cell.querySelector("a[href]")

			if(a.contains(htmlTarget))
				col.onLink(colValue)
		}
	}
}
