import { Pipe, PipeTransform } from "@angular/core"
import { TranslateService } from "../services"

@Pipe({
    name: "translate",
    standalone: true,
    pure: false
})
export class TranslatePipe implements PipeTransform {
    constructor(private ts: TranslateService){}

    transform = (value: string, args?: Record<string, string>) => this.ts.translate(value, args)
}
