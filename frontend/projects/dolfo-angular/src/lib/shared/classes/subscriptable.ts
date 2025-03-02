import { Directive, OnDestroy } from "@angular/core"
import { Subscription } from "rxjs"

@Directive()
export abstract class Subscriptable implements OnDestroy{
    private subs: Subscription[] = []

    protected addSubscription = (sub: Subscription) => this.subs.push(sub)

    ngOnDestroy(){
        this.subs.forEach(s => s.unsubscribe())
    }
}
