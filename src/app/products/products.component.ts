import { Component, OnInit } from "@angular/core";
import { Product } from "../shared/models/product.model";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    private url1 =
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

    private url2 =
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

    private url3 =
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

    constructor() {}

    ngOnInit(): void {
        const _product1 = new Product(
            "book",
            999,
            this.url1,
            "You can read it!"
        );

        const _product2 = new Product(
            "headphones",
            24999,
            this.url2,
            "Listen to stuff!"
        );

        const _product3 = new Product(
            "Backpack",
            7999,
            this.url3,
            "Carry things around town!"
        );

        this.products.push(_product1, _product2, _product3);
    }
}
