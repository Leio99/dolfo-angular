import { ProviderToken, Type } from "@angular/core"
import { CanActivateFn, Route } from "@angular/router"
import { Observable } from "rxjs"
import { RouteCheckService } from "../services"

interface Module{
    [x: string]: Type<unknown>
}

export class RouteConfig{
    private loadComponent: () => Promise<Type<unknown>>
    private redirectTo: string
    private pathMatch: "full" | "prefix" = "full"
    private title: (() => Observable<string> | string) | string
    private canActivate: Array<CanActivateFn | ProviderToken<any> | string> = []

    constructor(private path: string, withRouteCheck = true){
        if(withRouteCheck)
            this.canActivate.push(RouteCheckService)
    }

    public withTitle = (title: typeof this.title) => {
        this.title = title
        return this
    }

    public loadUrl = (imp: Promise<Module>) => {
        this.loadComponent = () => imp.then(t => Object.values(t)[0])
        return this
    }

    public withRedirect = (url: string) => {
        this.redirectTo = url
        return this
    }

    public addGuard = (guard: CanActivateFn | ProviderToken<any> | string | Array<CanActivateFn | ProviderToken<any> | string>) => {
        if(Array.isArray(guard))
            this.canActivate.push(...guard)
        else
            this.canActivate.push(guard)
        
        return this
    }

    public toRoute = (): Route => ({
        loadComponent: this.loadComponent,
        path: this.path,
        pathMatch: this.pathMatch,
        title: this.title,
        redirectTo: this.redirectTo,
        canActivate: this.canActivate
    })
}