import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from "@angular/router"

export class RouterReloadStrategy extends BaseRouteReuseStrategy {
    override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot) {
        if (future.routeConfig === curr.routeConfig)
            return false

        return super.shouldReuseRoute(future, curr)
    }
}