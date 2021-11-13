import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
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
}
