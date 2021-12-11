import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject, NEVER } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError, filter, switchMap } from "rxjs/operators";

import { Product } from "../models/product.model";
import { Auth } from "./auth";
import {
    Config,
    LoginRequest,
    apiResponse,
    apiUser,
    Order,
    addToCartRequest,
    OrderProduct,
    updatedCartItemRequest,
    removeCartItemRequest
} from "../utilities/config";
import { SharedDataService } from "./shared-data.service";
import { submitFormRequest } from "src/app/cart/client-form/client-form.component";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    constructor(
        private http: HttpClient,
        private auth: Auth,
        private config: Config,
        private sharedService: SharedDataService
    ) {}

    private handleError(error: HttpErrorResponse) {
        const status = error?.status ? error.status : "<no code defined>";
        console.error(`Backend returned code ${status}, body was: `, error);
        return throwError(error.message);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<apiResponse>(this.config.routes.allProducts()).pipe(
            map((response) => this.config.serializeAllProducts(response.data)),
            catchError(this.handleError)
        );
    }

    getProduct(id: number): Observable<Product> {
        const getProductRoute = this.config.routes.peIndexId(id),
            serialize = this.config.serializeProduct.bind(this.config);

        return this.http.get<apiResponse>(getProductRoute).pipe(
            map((response) => serialize(response.data)),
            catchError(this.handleError)
        );
    }

    login(loginRequest: LoginRequest): Observable<Boolean> {
        return this.http
            .post<apiResponse>(this.config.routes.authenticateUser(), loginRequest)
            .pipe(
                tap((response) => this.auth.doLoginUser(response.data)),
                tap((response) => this.auth.initUser(response.data)),
                map((response) => !!response.data),
                catchError(this.handleError)
            );
    }

    getCurrentUser$(): Observable<apiUser> {
        return this.auth.getCurrentUser();
    }

    isLoggedIn$(): Observable<Boolean> {
        return this.auth.getCurrentUser().pipe(
            map((user) => {
                return !!user;
            }),
            catchError((err) => {
                return of(false);
            })
        );
    }

    getActiveOrder(userId: number): Observable<Order> {
        return this.http
            .get<apiResponse>(this.config.routes.orders(userId), {
                headers: this.auth.getAuthorizationHeader()
            })
            .pipe(
                map((resp) => this.config.serializeOrder(resp.data)),
                catchError(this.handleError)
            );
    }

    createOrder(userId: number): Observable<Order> {
        return this.http
            .post<apiResponse>(
                this.config.routes.createOrder(userId),
                {},
                {
                    headers: this.auth.getAuthorizationHeader()
                }
            )
            .pipe(
                map((resp) => this.config.serializeOrder(resp.data)),
                catchError(this.handleError)
            );
    }

    getActiveOrder$(userId: number): Observable<Order> {
        return this.getActiveOrder(userId).pipe(
            catchError(() => {
                // an active order did not exist so create one...
                return this.createOrder(userId);
            })
        );
    }

    /**
     *
     * Add item to cart
     */
    addToCart(_addProductRequest: addToCartRequest): Observable<OrderProduct> {
        const { orderId } = _addProductRequest,
            addToCartRoute = this.config.routes.addProduct(<number>orderId),
            serialize = this.config.serializeSingleProductInCart_ORDER.bind(this.config);

        return this.http.post<apiResponse>(addToCartRoute, _addProductRequest).pipe(
            map((response) => serialize(response.data)),
            tap((cartItem) => this.sharedService.addCartItem(cartItem)),
            catchError(this.handleError)
        );
    }

    /**
     *
     * Cart Items for a specific order
     */
    getCartItems(orderId: number): Observable<OrderProduct[]> {
        const getCartItemsRoute = this.config.routes.cartItems(orderId),
            serialize = this.config.serializeCartItems.bind(this.config);

        return this.http.get<apiResponse>(getCartItemsRoute).pipe(
            map((response) => serialize(response.data)),
            tap((cartItems) => this.sharedService.sendCartItems(cartItems)),
            catchError(this.handleError)
        );
    }

    updateCartItem(body: updatedCartItemRequest): Observable<boolean> {
        const { orderId } = body,
            updateCartItemRoute = this.config.routes.updateCartItem(orderId),
            headers = { headers: this.auth.getAuthorizationHeader() };

        return this.http.patch<apiResponse>(updateCartItemRoute, body, headers).pipe(
            map((response) => !!response.data),
            catchError(this.handleError)
        );
    }

    removeCartItem(removeCartItemRequest: removeCartItemRequest): Observable<boolean> {
        const productId = removeCartItemRequest.productId;
        return this.http
            .delete<apiResponse>(
                this.config.routes.removeCartItem(removeCartItemRequest),
                {
                    headers: this.auth.getAuthorizationHeader()
                }
            )
            .pipe(
                map((response) => !!response.data),
                tap((_) => this.sharedService.removeCartItem(productId)),
                catchError(this.handleError)
            );
    }

    closeOrder(request: submitFormRequest): Observable<string> {
        const { orderId } = request,
            closeOrderRoute = this.config.routes.oeCloseOrder(<number>orderId),
            authHeader = this.auth.getAuthorizationHeader();

        return this.http
            .delete<apiResponse>(closeOrderRoute, {
                headers: authHeader
            })
            .pipe(
                tap((_) => this.sharedService.clearCart()),
                switchMap((_) => this.createShipping(request)),
                catchError(this.handleError)
            );
    }

    private createShipping(request: submitFormRequest): Observable<string> {
        const { orderId } = request,
            createShippingRoute = this.config.routes.oeCreateShipping(<number>orderId),
            authHeader = this.auth.getAuthorizationHeader();

        return this.http
            .post<apiResponse>(createShippingRoute, request, {
                headers: authHeader
            })
            .pipe(map((response) => <string>response.message + " [createShipping]"));
    }
}
