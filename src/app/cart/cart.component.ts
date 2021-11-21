import { observable, Observable, zip, of, timer, merge } from "rxjs";
import { debounce, filter, map, tap } from "rxjs/operators";
import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    ComponentFactory,
    AfterViewInit,
    ChangeDetectorRef,
    ViewChildren,
    QueryList,
    ElementRef
} from "@angular/core";

import { CartItemComponent } from "./cart-item/cart-item.component";
import { User } from "../shared/models/user.model";
import { HttpService } from "../shared/services/http.service";
import {
    Order,
    OrderProduct,
    removeCartItemRequest,
    updatedCartItemRequest
} from "../shared/utilities/config";
import { Product } from "../shared/models/product.model";

@Component({
    selector: "cart-parent",
    templateUrl: "./cart.component.html",
    styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit, AfterViewInit {
    /**
     * container where child components (cart-item) will be dynamically added
     */
    @ViewChild("itemsContainer", { read: ViewContainerRef }) container!: ViewContainerRef;

    @ViewChild("totalContent")
    private _elemTotalContent!: ElementRef<HTMLElement>;

    @ViewChild("totalXtra")
    private _elemTotalXtra!: ElementRef<HTMLElement>;

    private order!: Order;
    isLoggedIn = false;
    cartItemsCount = 0;
    cartTotal = 0;

    private cartItemComponents: ComponentRef<CartItemComponent>[] = [];

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
                        this.cartItemsCount = cartItems.length;
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
        let totalAmount = 0;
        cartItems.forEach((thisCartItem) => {
            //
            const thisProduct = products.find(
                (thisProduct) => thisProduct.id === thisCartItem.productId
            );

            const component = this.createCartItemComponent();
            component.instance._product = <Product>thisProduct;
            component.instance._qty = thisCartItem.qty;
            this.cartItemComponents.push(component);

            // calculate total
            let thisProductPrice = <number>thisProduct?.price / 100,
                qty = thisCartItem.qty,
                thisItemTotal = thisProductPrice * qty;
            totalAmount += thisItemTotal;

            /*
                child component event-emitter logic
                when cart-item submits a quantity change of product */

            const source$ = component.instance.amountEmitEvent.asObservable().pipe(
                tap((_) => this.addStyleTotalAmount(true)),
                debounce(() => timer(1000))
            );

            const processQtyChanged$ = source$.pipe(
                filter((emitData) => emitData.qty !== 0),
                tap((emitData) => this.handleOnCartItemQtyChanged(emitData))
            );

            const processOnDelete$ = source$.pipe(
                filter((emitData) => emitData.qty === 0),
                tap((emitData) => this.handleOnCartItemRemove(emitData))
            );

            const processAll$ = merge(processQtyChanged$, processOnDelete$);

            processAll$.subscribe();
        });

        this.cartTotal = totalAmount;
    }

    private handleOnCartItemRemove(data: AmountEmitPayload): void {
        const { productId } = data;
        const orderId = <number>this.order.id;

        const request: removeCartItemRequest = {
            orderId,
            productId
        };

        const thisCartItemComponent = <ComponentRef<CartItemComponent>>(
            this.cartItemComponents.find((cmp) => cmp.instance._product.id === productId)
        );

        this.apiSvc.removeCartItem(request).subscribe((_) => {
            alert("removed from cart!");
            thisCartItemComponent.destroy();
            this.cartTotal = this.calcCartTotal();
            this.addStyleTotalAmount();
            this.cartItemsCount--;
        });
    }

    private handleOnCartItemQtyChanged(data: AmountEmitPayload): void {
        const { productId, qty } = data;
        const orderId = <number>this.order.id;

        const updateRequest: updatedCartItemRequest = {
            productId,
            qty,
            orderId
        };

        this.apiSvc.updateCartItem(updateRequest).subscribe((_) => {
            this.cartTotal = this.calcCartTotal();
            this.addStyleTotalAmount();
        });
    }

    private addStyleTotalAmount(preprocess?: boolean): void {
        if (!preprocess) {
            this._elemTotalContent.nativeElement.classList.remove("calc");
            this._elemTotalXtra.nativeElement.innerText = "";
            return;
        }

        this._elemTotalContent.nativeElement.classList.add("calc");
        this._elemTotalXtra.nativeElement.innerText = "(calculating...)";
    }

    private calcCartTotal(): number {
        let totalAmount = 0;

        this.cartItemComponents.forEach((cartItemComponent) => {
            const thisComponent = cartItemComponent.instance,
                thisProductPrice = thisComponent._product.price / 100,
                quantity = thisComponent._qty,
                thisItemTotal = thisProductPrice * quantity;
            totalAmount += thisItemTotal;
        });
        return totalAmount;
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
};
