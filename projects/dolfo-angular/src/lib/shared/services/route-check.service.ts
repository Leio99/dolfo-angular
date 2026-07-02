import { inject, Service } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router"
import { catchError, mergeMap, of } from "rxjs"
import { ROUTE_CHECK_SERVICE } from "../interfaces"
import { StoreService } from "./"

@Service()
export class RouteCheckService implements CanActivate{
    private storeService = inject(StoreService)
    private routeService = inject(ROUTE_CHECK_SERVICE)

    public canActivate({ routeConfig }: ActivatedRouteSnapshot) {
        if(!this.storeService.isInitialized())
            return false

        return this.routeService.load$().pipe(
            catchError(() => of(null)),
            mergeMap(() => this.routeService.checkRoute(routeConfig.path))
        )
    }
}