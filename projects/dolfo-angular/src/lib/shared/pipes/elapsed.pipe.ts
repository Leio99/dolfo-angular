import { inject, Pipe, PipeTransform } from "@angular/core"
import { TranslateService } from "../services"

@Pipe({ name: "elapsed", pure: false })
export class ElapsedPipe implements PipeTransform {
    private translateService = inject(TranslateService)

    public transform = (value: Date) =>  {
        const date = new Date(value),
        diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000)

        if (diffInSeconds < 60)
            return this.translateService.translate("date.secondsAgo", { seconds: diffInSeconds.toString() })

        const diffInMinutes = Math.floor(diffInSeconds / 60)

        if (diffInMinutes < 60)
            return this.translateService.translate("date.minutesAgo", { minutes: diffInMinutes.toString() })

        const diffInHours = Math.floor(diffInMinutes / 60)

        if (diffInHours < 24)
            return this.translateService.translate("date.hoursAgo", { hours: diffInHours.toString() })

        const diffInDays = Math.floor(diffInHours / 24)

        if(diffInDays < 30)
            return this.translateService.translate("date.daysAgo", { days: diffInDays.toString() })

        const diffInMonths = Math.floor(diffInDays / 30)

        if(diffInMonths < 12)
            return this.translateService.translate("date.monthsAgo", { months: diffInMonths.toString() })

        return this.translateService.translate("date.yearsAgo", { years: Math.floor(diffInMonths / 12).toString() })
    }
}
