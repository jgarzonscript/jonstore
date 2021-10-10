import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

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
            .pipe(tap((data) => this.auth.doLoginUser(data?.data)));
    }

    getCurrentUser$(): Observable<User | undefined> {
        return this.auth.getCurrentUser();
    }
}
