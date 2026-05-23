import { AfterViewInit, Directive, inject, Injector, OnInit, signal, ViewContainerRef } from "@angular/core"
import { Router } from "@angular/router"
import { concatAll, from, Observable, tap } from "rxjs"
import { StoreService } from "../services"
import { OverlayManager, Subscriptable } from "./"

@Directive()
export abstract class BaseAppComponent extends Subscriptable implements OnInit, AfterViewInit{
    protected abstract container: ViewContainerRef

    protected abstract readonly streams: Observable<string>[]

    protected injector = inject(Injector)
    protected router = inject(Router)
    protected storeService = inject(StoreService)

    private loading = signal(0)
    public loadingMessage = signal("...")

    ngOnInit(){
        from(Object.values(this.streams)).pipe(
            concatAll(),
            tap(desc => {
                this.loading.update(item => item + 1)
                this.loadingMessage.set(desc + "...")
            })
        ).subscribe(() => {
            if(this.loading() === Object.keys(this.streams).length){
                setTimeout(() => {
                    this.loadingMessage.set(null)
                    this.storeService.initialize()
                    this.router.initialNavigation()
                }, 500)
            }
        })
    }

    ngAfterViewInit(){
        new OverlayManager(this.injector, this.container).init().forEach(s => this.addSubscription(s))
    }

    public get percentage(){
        return (this.loading() * 100) / Object.keys(this.streams).length
    }
}