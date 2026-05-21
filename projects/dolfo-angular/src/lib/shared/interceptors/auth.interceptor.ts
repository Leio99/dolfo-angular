import { HttpHandlerFn, HttpRequest } from "@angular/common/http"
import { inject } from "@angular/core"
import { StorageValues } from "../interfaces"
import { TranslateService } from "../services"

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const translateService = inject(TranslateService),
    clone = req.clone({
        headers: req.headers.set("Client-lang", translateService.getLang().name)
    })

    if (!!localStorage.getItem(StorageValues.TOKEN)) {
        return next(clone.clone({
            headers: clone.headers.set("Authorization", "Bearer " + localStorage.getItem(StorageValues.TOKEN))
        }))
    }

    return next(clone)
}
