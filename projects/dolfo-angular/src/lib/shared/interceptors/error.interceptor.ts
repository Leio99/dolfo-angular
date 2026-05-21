import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, throwError } from "rxjs"
import { StorageValues } from "../interfaces"
import { NotificationService, TranslateService } from "../services"

export const errorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const notificationService = inject(NotificationService),
    translateService = inject(TranslateService)

    return next(req).pipe(
        catchError(err => {
            if(err instanceof HttpErrorResponse){
                if(err.status === 401)
                    localStorage.removeItem(StorageValues.TOKEN)
                
                notificationService.show({
                    type: "error",
                    title: translateService.translate("dialog.errorApi"),
                    message: typeof err.error === "string" ? err.error : err.message
                })
            }

            return throwError(() => err)
        })
    )
}