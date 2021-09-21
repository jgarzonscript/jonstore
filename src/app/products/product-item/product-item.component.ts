import { Component, OnInit, Input } from "@angular/core";
import { Product } from "src/app/shared/models/product.model";

@Component({
    selector: "product-item",
    templateUrl: "./product-item.component.html",
    styleUrls: ["./product-item.component.css"]
})
export class ProductItemComponent implements OnInit {
    @Input() product!: Product;

    constructor() {}

    ngOnInit(): void {}
}
