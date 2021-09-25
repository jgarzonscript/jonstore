import { Component, OnInit } from "@angular/core";
import { Product } from "../shared/models/product.model";
import { HttpService } from "../shared/http.service";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];

    constructor(private http: HttpService) {}

    ngOnInit(): void {
        this.http.getProducts().subscribe((data) => (this.products = data));
    }
}
