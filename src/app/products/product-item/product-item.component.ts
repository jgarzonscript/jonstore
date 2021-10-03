import { Component, OnInit, Input } from "@angular/core";
import { Product } from "src/app/shared/models/product.model";

@Component({
    selector: "product-item",
    templateUrl: "./product-item.component.html",
    styleUrls: ["./product-item.component.css"]
})
export class ProductItemComponent implements OnInit {
    @Input() product!: Product;

    data: number[] = [1, 2, 3, 4, 5, 6];
    quantitySelected: number = 1;

    constructor() {}

    ngOnInit(): void {}

    submit(): void {
        console.log(`quantity: ${this.quantitySelected}`);
    }
}
