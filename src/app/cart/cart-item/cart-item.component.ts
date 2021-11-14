import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { Subject, timer, Subscription } from "rxjs";
import { debounce, map } from "rxjs/operators";

import { Product } from "src/app/shared/models/product.model";
import { AmountEmitPayload } from "../cart.component";

@Component({
    selector: "cart-item",
    templateUrl: "./cart-item.component.html",
    styleUrls: ["./cart-item.component.css"]
})
export class CartItemComponent implements OnInit {
    _product!: Product;
    _qty!: number;

    amount$ = new Subject<AmountEmitPayload>();
    subscription!: Subscription;

    @Output() amountEmitEvent = new EventEmitter<AmountEmitPayload>();

    noImg = "https://genesisairway.com/wp-content/uploads/2019/05/no-image.jpg";
    noName = "< demo product >";

    constructor() {
        this.subscription = this.amount$
            .asObservable()
            .pipe(debounce(() => timer(2000)))
            .subscribe((nextVal) => this.amountEmitEvent.emit(nextVal));
    }

    ngOnInit(): void {
        var here = true;
    }

    onChangeAmount(val: number): void {
        const data: AmountEmitPayload = {
            productId: this._product.id as number,
            qty: val
        };

        this.amount$.next(data);
    }

    // observerAmount$(next: any): void {
    //     this.amountEmitEvent.emit(next);

    //     /*
    //     update to database */
    //     // const updatePayload: updatedCartItemRequest = {
    //     // }
    //     // this.apiSvc.updateCartItem()
    // }

    // ngAfterViewInit() {
    //     // let elementRef = this.tpl.elementRef;
    //     // console.log(elementRef.nativeElement.textContent);
    // }
}
