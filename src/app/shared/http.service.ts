import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { Product } from "./models/product.model";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    constructor(private http: HttpClient) {}

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
}
