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
    @Output() imgClickedEvent = new EventEmitter<number>();

    data: number[] = [1, 2, 3, 4, 5, 6];
    quantitySelected: number = 1;

    imgModAdded = 0;

    constructor() {}

    ngOnInit(): void {
        this.initProductAncillaries();
    }

    /**
     * @description checkes to see if this product is already in cart
     * if yes -- display label on image
     */
    private initProductAncillaries(): void {
        if (this.productsInCart?.length) {
            /*
               if we have this-Product in the cart -- then.. */
            const cartItem = this.productsInCart.find(
                (cartItem) => cartItem.productId === this.product.id
            );

            if (cartItem) {
                this.imgModAdded = 1;
                this.quantitySelected = cartItem.qty;
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
