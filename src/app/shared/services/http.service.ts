import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject, NEVER } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";

import { Product } from "../models/product.model";
import { Auth } from "./auth";
import {
    Config,
    LoginRequest,
    apiResponse,
    apiUser,
    Order,
    addProductRequest,
    OrderProduct,
    updatedCartItemRequest,
    removeCartItemRequest
} from "../utilities/config";
import { SharedDataService } from "./shared-data.service";

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
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
        return throwError(error.error.message);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<apiResponse>(this.config.routes.allProducts()).pipe(
            map((response) => this.config.serializeAllProducts(response.data)),
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
            .get<apiResponse>(this.config.routes.orderByUser(userId), {
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
    addProductToOrder(
        orderId: number,
        _addProductRequest: addProductRequest
    ): Observable<OrderProduct> {
        return this.http
            .post<apiResponse>(this.config.routes.addProduct(orderId), _addProductRequest)
            .pipe(
                map((response) =>
                    this.config.serializeSingleProductInCart_ORDER(response.data)
                ),
                tap((cartItem) => this.sharedService.addCartItem(cartItem)),
                catchError(this.handleError)
            );
    }

    /**
     *
     * Cart Items for a specific order
     */
    getProductsInCart(orderId: number): Observable<OrderProduct[]> {
        return this.http
            .get<apiResponse>(this.config.routes.productsInCart(orderId))
            .pipe(
                map((response) =>
                    this.config.serializeProductsInCart_ORDER(response.data)
                ),
                tap((cartItems) => this.sharedService.sendCartItems(cartItems)),
                catchError(this.handleError)
            );
    }

    updateCartItem(updatedCartItemRequest: updatedCartItemRequest): Observable<boolean> {
        return this.http
            .patch<apiResponse>(
                this.config.routes.updateCartItem(updatedCartItemRequest.orderId),
                updatedCartItemRequest,
                {
                    headers: this.auth.getAuthorizationHeader()
                }
            )
            .pipe(
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
}
