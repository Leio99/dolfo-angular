import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http"
import { inject, InjectionToken } from "@angular/core"
import { catchError, throwError } from "rxjs"
import { StorageValues } from "../interfaces"
import { NotificationService, TranslateService } from "../services"

export const MAX_MEGABYTES_SIZE = new InjectionToken<number>("MAX_MEGABYTES_SIZE", { factory: () => 50 })

export const errorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const notificationService = inject(NotificationService),
    translateService = inject(TranslateService),
    mb = inject(MAX_MEGABYTES_SIZE)

    return next(req).pipe(
        catchError(err => {
            if(err instanceof HttpErrorResponse){
                let message = typeof err.error === "string" ? err.error : err.message

                if(err.status === 401)
                    localStorage.removeItem(StorageValues.TOKEN)
                else if(req.body){
                    const payloadString = JSON.stringify(req.body),
                    actualSizeBytes = new Blob([payloadString]).size,
                    maxMbs = mb,
                    reqMbs = actualSizeBytes / 1024 / 1024

                    if(reqMbs > maxMbs)
                        message = translateService.translate("errors.requestTooBig", { maxMbs: maxMbs.toString(), reqMbs: reqMbs.toFixed(2) })
                }
                
                notificationService.show({
                    type: "error",
                    title: translateService.translate("errors.api"),
                    message
                })
            }

            return throwError(() => err)
        })
    )
}