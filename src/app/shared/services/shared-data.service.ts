import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { take } from "rxjs/operators";
import { OrderProduct } from "../utilities/config";

@Injectable({
    providedIn: "root"
})
export class SharedDataService {
    private cartItemsBS = new BehaviorSubject<OrderProduct[]>([]);
    CartItems$ = this.cartItemsBS.asObservable();

    constructor() {}

    sendCartItems(cartItems: OrderProduct[]): void {
        this.cartItemsBS.next(cartItems);
    }

    addCartItem(cartItem: OrderProduct): void {
        const sub = this.CartItems$.pipe(take(1)).subscribe((previousValue) => {
            const currentCartItems = previousValue;
            currentCartItems.push(cartItem);
            this.cartItemsBS.next(currentCartItems);
        });
    }
}
