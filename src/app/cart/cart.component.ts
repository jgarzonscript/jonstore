import { observable, Observable, zip, of } from "rxjs";
import { map } from "rxjs/operators";
import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    ComponentFactory,
    AfterViewInit,
    ChangeDetectorRef
} from "@angular/core";

import { CartItemComponent } from "./cart-item/cart-item.component";
import { User } from "../shared/models/user.model";
import { HttpService } from "../shared/services/http.service";
import { Order, OrderProduct, updatedCartItemRequest } from "../shared/utilities/config";
import { Product } from "../shared/models/product.model";

@Component({
    selector: "cart-parent",
    templateUrl: "./cart.component.html",
    styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit, AfterViewInit {
    @ViewChild("itemsContainer", { read: ViewContainerRef }) container!: ViewContainerRef;
    private order!: Order;
    isLoggedIn = false;

    constructor(
        private resolver: ComponentFactoryResolver,
        private cd: ChangeDetectorRef,
        private _user: User,
        private apiSvc: HttpService
    ) {
        this.isLoggedIn = _user.isLoggedIn;
    }

    ngOnInit(): void {
        /*
         Sequence of events
         1. fetch orders
         2. fetch cart-items
         3. fetch all products  */

        this.initOrders().subscribe((_order) => {
            this.order = _order;

            zip(this.initCartItems(_order.id), this.initProducts()).subscribe(
                (responseArray) => {
                    const [cartItems, productItems] = responseArray,
                        cartItemsExist = !!cartItems.length;

                    this.container.clear();
                    if (cartItemsExist) {
                        this.loadCartItems(cartItems, productItems);
                        this.cd.detectChanges();
                    }

                    if (!cartItemsExist) {
                        this.emptyCartItem();
                    }
                }
            );
        });
    }

    /**
     * populates (dynamically) 'cart-item components' per item from cart
     */
    private loadCartItems(cartItems: OrderProduct[], products: Product[]): void {
        cartItems.forEach((thisCartItem) => {
            //
            const thisProduct = products.find(
                (thisProduct) => thisProduct.id === thisCartItem.productId
            );

            const component = this.createCartItemComponent();
            component.instance._product = <Product>thisProduct;
            component.instance._qty = thisCartItem.qty;

            /*
                child component event-emitter logic
                when cart-item submits a quantity change of product */

            component.instance.amountEmitEvent
                .asObservable()
                .pipe(
                    map((nextVal) => {
                        nextVal.cartComponent = this;
                        return nextVal;
                    })
                )
                .subscribe(this.handleAmountEmitter);
        });
    }

    handleAmountEmitter(data: AmountEmitPayload): void {
        const { cartComponent, productId, qty } = data;
        const orderId = cartComponent?.order.id as number;

        const updateRequest: updatedCartItemRequest = {
            productId,
            qty,
            orderId
        };

        cartComponent?.apiSvc.updateCartItem(updateRequest).subscribe();
    }

    ngAfterViewInit() {
        // create dummy cart-item component when nothing is available
        if (!this.isLoggedIn) {
            this.emptyCartItem();
        }
    }

    private emptyCartItem(): void {
        // const dummyProduct = new Product("", 0),
        //     component = this.createCartItemComponent();
        // component.instance._product = dummyProduct;
        this.createCartItemComponent();
        this.cd.detectChanges();
    }

    private createCartItemComponent(): ComponentRef<CartItemComponent> {
        const factory = this.resolver.resolveComponentFactory(CartItemComponent);
        const componentRef = this.container.createComponent(factory);
        return componentRef;
        // componentRef.instance._product = product;
        // this.cd.detectChanges();
    }

    private initOrders(): Observable<Order> {
        return new Observable((observer) => {
            if (this._user.isLoggedIn) {
                this.apiSvc.getActiveOrder$(this._user.id).subscribe(
                    (order) => observer.next(order),
                    (error) => console.log(`error fetching active order; ${error}`)
                );
            }
        });
    }

    private initCartItems(orderId: number): Observable<OrderProduct[]> {
        return new Observable((observer) => {
            this.apiSvc.getProductsInCart(orderId).subscribe(
                (cartItems) => observer.next(cartItems),
                (error) => console.log(`error fetching cart-items; ${error}`)
            );
        });
    }

    private initProducts(): Observable<Product[]> {
        return new Observable((observer) => {
            this.apiSvc.getProducts().subscribe(
                (productItems) => observer.next(productItems),
                (error) => console.log(`error fetching products; ${error}`)
            );
        });
    }
}

export type AmountEmitPayload = {
    productId: number;
    qty: number;
    cartComponent?: CartComponent;
};
