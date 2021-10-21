import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject, NEVER } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";

import { Product } from "../models/product.model";
import { Auth } from "./auth";
import { Config, LoginRequest, apiResponse, User, Order } from "../utilities/config";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    constructor(private http: HttpClient, private auth: Auth, private config: Config) {}

    private handleError(error: HttpErrorResponse) {
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
        return throwError(error.error.message);
    }

    getProducts(): Observable<Product[]> {
        return this.http
            .get<apiResponse>(this.config.routes.allProducts())
            .pipe(map((response) => this.config.serializeAllProducts(response.data)));
    }

    login(loginRequest: LoginRequest): Observable<Boolean> {
        return this.http
            .post<apiResponse>(this.config.routes.authenticateUser(), loginRequest)
            .pipe(
                tap((response) => this.auth.doLoginUser(response.data)),
                map((response) => !!response.data),
                catchError(this.handleError)
            );
    }

    getCurrentUser$(): Observable<User> {
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
}
