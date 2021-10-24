import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Product } from "src/app/shared/models/product.model";
import { OrderProduct } from "src/app/shared/utilities/config";
// import { addProduct } from "src/app/shared/models/product.model";

@Component({
    selector: "product-item",
    templateUrl: "./product-item.component.html",
    styleUrls: ["./product-item.component.css"]
})
export class ProductItemComponent implements OnInit {
    @Input() product!: Product;
    @Output() addProduct = new EventEmitter<any>();
    @Input("cart") productsInCart!: OrderProduct[];

    data: number[] = [1, 2, 3, 4, 5, 6];
    quantitySelected: number = 1;

    constructor() {}

    ngOnInit(): void {
        var here = true;
        if (this.productsInCart.length) {
            var here = true;
        }
    }

    submit(): void {
        this.addProduct.emit({ id: this.product.id, qty: this.quantitySelected });
    }
}
