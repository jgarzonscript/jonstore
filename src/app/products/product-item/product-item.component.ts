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

    imgModAdded = 0;

    constructor() {}

    ngOnInit(): void {
        this.findAndShowLabel();
    }

    /**
     * @description checkes to see if this product is already in cart
     * if yes -- display label on image
     */
    private findAndShowLabel(): void {
        if (this.productsInCart?.length) {
            const thisProductId = String(this.product.id);
            if (
                this.productsInCart
                    .map((cartItem) => cartItem.productId)
                    .indexOf(parseInt(thisProductId)) >= 0
            ) {
                this.imgModAdded = 1;
            }
        }
    }

    initImgLabel(cartItem: OrderProduct): void {
        if (this.product.id === cartItem.productId) {
            this.imgModAdded = 1;
        }
    }

    submit(): void {
        this.addProduct.emit({ id: this.product.id, qty: this.quantitySelected });
    }
}
