import { InjectionToken } from "@angular/core"
import { Observable } from "rxjs"

export const ROUTE_CHECK_SERVICE = new InjectionToken<CheckRoute<unknown>>("ROUTE_CHECK_SERVICE", {
	providedIn: "root",
	factory: () => {
		throw new Error("RouteCheckService not provided")
	}
})

export interface CheckRoute<T>{
	load$: () => Observable<T>
	checkRoute: (path: string) => Promise<boolean> | Observable<boolean>
}