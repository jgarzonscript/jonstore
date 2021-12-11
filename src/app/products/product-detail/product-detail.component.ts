import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { Product } from "src/app/shared/models/product.model";
import { HttpService } from "src/app/shared/services/http.service";
import { EMPTY } from "rxjs";
import { User } from "src/app/shared/models/user.model";
import {
    addToCartRequest,
    OrderProduct,
    updatedCartItemRequest
} from "src/app/shared/utilities/config";

@Component({
    selector: "product-detail",
    templateUrl: "./product-detail.component.html",
    styleUrls: ["./product-detail.component.css"]
})
export class ProductDetailComponent implements OnInit {
    product!: Product;
    _qty: number = 0;
    isSignedIn = true;
    cartItem!: OrderProduct;

    _orderId!: string;
    _productId!: string;

    onSave = 0;
    pdMessage = "";

    constructor(
        private apiSvc: HttpService,
        private route: ActivatedRoute,
        private user: User
    ) {}

    ngOnInit(): void {
        const productId = <string>this.route.snapshot.paramMap.get("id"),
            orderId = <string>this.route.snapshot.queryParamMap.get("orderid"),
            isSignedIn = this.user.isLoggedIn;

        this._orderId = orderId;
        this._productId = productId;

        this.loadProduct(productId).subscribe((product) => {
            this.product = product;

            if (!isSignedIn) return;

            this.loadCartItem(orderId, productId);
        });
    }

    private loadProduct(productId: string): Observable<Product> {
        const id = parseInt(productId);
        return new Observable((observer) => {
            this.apiSvc.getProduct(id).subscribe((product) => {
                observer.next(product);
                observer.complete();
            });
        });
    }

    private loadCartItem(orderId: string, productId: string): void {
        const id = parseInt(orderId),
            pId = parseInt(productId);

        this.apiSvc.getCartItems(id).subscribe((cartItems) => {
            const thisCartItem = cartItems.find((item) => item.productId === pId);
            if (thisCartItem) {
                this.cartItem = thisCartItem;
                this._qty = thisCartItem.qty;
            }
        });
    }

    private handleError(err: any): void {
        console.log(JSON.stringify(err));
    }

    onAddToCart(quantity: string): void {
        const qty = parseInt(quantity),
            isSignedIn = this.user.isLoggedIn,
            orderId = parseInt(this._orderId),
            productId = parseInt(this._productId);

        if (!isSignedIn) {
            alert("You must be `signed in' to add items to cart!");
            return;
        }

        // set the successful message
        this.pdMessage = "added to cart!";

        const request: addToCartRequest = {
            orderId,
            productId,
            qty
        };

        this.apiSvc.addToCart(request).subscribe((cartItem) => {
            this.cartItem = cartItem;
            this.onSave++;
        });
    }

    onUpdate(quantity: string): void {
        const qty = parseInt(quantity),
            orderId = parseInt(this._orderId),
            productId = parseInt(this._productId);

        // set the successful message
        this.pdMessage = "saved!";

        const request: updatedCartItemRequest = {
            orderId,
            productId,
            qty
        };

        this.apiSvc.updateCartItem(request).subscribe((_) => {
            this.onSave++; // trigger directive show message
        });
    }
}
