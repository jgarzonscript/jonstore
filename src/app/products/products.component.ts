import { Component, OnInit, ViewChild } from "@angular/core";
import { Product } from "../shared/models/product.model";
import { HttpService } from "../shared/services/http.service";
import { Router } from "@angular/router";
import { addProductRequest, Order, OrderProduct } from "../shared/utilities/config";
import { User } from "../shared/models/user.model";
import { Observable, zip } from "rxjs";

import { ProductItemComponent } from "./product-item/product-item.component";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    private order!: Order;
    showModalContent = 0;
    hideModal = 0;
    removeModal = 0;
    productsInCart!: OrderProduct[];

    @ViewChild(ProductItemComponent) private productComponent!: ProductItemComponent;

    constructor(private http: HttpService, private router: Router, private user: User) {}

    ngOnInit(): void {
        const startTime = Date.now();

        // starts modal sequence
        setTimeout(() => {
            this.showModalContent = 1;
        }, 500);

        const initproducts = this.http.getProducts();
        const initorders = this.initOrders();

        const allInits = zip(initproducts, initorders);
        allInits.subscribe((outputArr) => {
            const [allProducts, order] = outputArr;

            /*
                Sequence of events
                0. fetch products [this is done at this point]
                1. fetch active order [this is done at this point]
                2. fetch products in Cart
                4. initialize component properties prior to populating product-item (child)
            */

            const init = new Promise((resolve) => {
                /*
                -
                -   skip logic if no active order present */
                if (!order) {
                    resolve(true);
                }

                if (order) {
                    this.order = order; // #4

                    // #2 -- fetch products in Cart
                    this.http
                        .getProductsInCart(this.order.id)
                        .subscribe((productsInCart) => {
                            this.productsInCart = productsInCart; // #4
                            resolve(true);
                        });

                    /* TO-DO 10/23: 
                        Code in logic for when getProductsByOrder() fails
                    */
                }
            });

            init.then(() => {
                this.products = allProducts; // #4
                this.endModal(startTime);
            });
        });
    }

    private endModal(startTime: number): void {
        // transition logic for modal removal
        const endTime = Date.now();
        const diff = Math.abs((startTime - endTime) / 1000);
        if (diff <= 1) {
            setTimeout(() => {
                this.hideModal = 1;
                setTimeout(() => {
                    this.removeModal = 1;
                }, 500);
            }, 1000);
        } else {
            this.hideModal = 1;
            setTimeout(() => {
                this.removeModal = 1;
            }, 500);
        }
    }

    private initOrders(): Observable<any> {
        return new Observable((observer) => {
            if (this.user.isLoggedIn) {
                this.http
                    .getActiveOrder$(this.user.id)
                    .subscribe((order) => observer.next(order));
            } else {
                observer.next(undefined);
            }
        });
    }

    /**
     * @description event - data passed from child
     * @param payload "{ id: number, qty: number }"
     */
    onAddProduct(payload: any): void {
        const productId: number = payload["id"],
            qty: number = payload["qty"];

        if (!this.order?.id) {
            alert("You must sign in to add items to cart!");
            return;
        }

        const addProductRequest: addProductRequest = {
            product_id: productId,
            quantity: qty
        };

        this.http
            .addProductToOrder(this.order.id, addProductRequest)
            .subscribe((cartItem) => this.productComponent.onAddProductToCart(cartItem));
    }
}
