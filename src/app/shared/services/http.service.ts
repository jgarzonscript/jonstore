import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";

import { Product } from "../models/product.model";
import { Auth } from "./auth";
import { Config, LoginRequest, apiResponse, User } from "../utilities/config";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    constructor(
        private http: HttpClient,
        private auth: Auth,
        private config: Config
    ) {}

    private handleError(error: HttpErrorResponse) {
        console.error(
            `Backend returned code ${error.status}, body was: `,
            error.error
        );
        return throwError(error.error.message);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<[]>("http://localhost:3000/products").pipe(
            map((data) => {
                return data
                    .map(
                        (product: Product) =>
                            new Product(
                                product["name"],
                                product["price"],
                                product["url"],
                                product["description"],
                                product["category_id"],
                                product["id"]
                            )
                    )
                    .filter((prod: Product) => prod.url?.length);
            })
        );
    }

    login(loginRequest: LoginRequest): Observable<apiResponse> {
        return this.http
            .post<apiResponse>(
                `${this.config.apiUrl}/users/authenticate`,
                loginRequest
            )
            .pipe(
                tap((data) => this.auth.doLoginUser(data?.data)),
                catchError(this.handleError)
            );
    }

    getCurrentUser$(): Observable<User | undefined> {
        return this.auth.getCurrentUser();
    }

    isLoggedIn$(): BehaviorSubject<boolean> {
        // return this.auth.getCurrentUser().pipe(
        //     map((user) => !!user),
        //     catchError(() => of(false))
        // );
        return this.auth.isUserLoggedIn;
    }
}
