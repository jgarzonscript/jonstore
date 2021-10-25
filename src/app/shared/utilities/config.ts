import { Injectable } from "@angular/core";
import { apiProduct, Product } from "../models/product.model";

@Injectable()
export class Config {
    routes!: Routes;

    constructor() {
        this.routes = new Routes();
    }

    serializeAllProducts(allProducts: apiProduct[]): Product[] {
        return allProducts
            .map((_product) => {
                return new Product(
                    _product["name"],
                    _product["price"],
                    _product["url"],
                    _product["description"],
                    _product["category_id"],
                    _product["id"]
                );
            })
            .filter((prod) => prod.url?.length);
    }

    serializeOrder(data: { id: number; user_id: string; status: string }): Order {
        const order: Order = {
            id: data["id"],
            userId: data["user_id"],
            status: data["status"]
        };
        return order;
    }

    serializeProductsInCart_ORDER(data: apiOrderProductResponse[]): OrderProduct[] {
        /*
    // identify any duplicate products */
        const duplicates = (function () {
            var duplicates = [];
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (i !== j) {
                        if (data[i].product_id === data[j].product_id) {
                            if (duplicates.indexOf(data[i].product_id) < 0)
                                duplicates.push(data[i].product_id);
                        }
                    }
                }
            }
            return duplicates;
        })();

        const output: OrderProduct[] = [];
        const addItem = (item: apiOrderProductResponse) => {
            output.push({
                productId: parseInt(item.product_id),
                qty: item.quantity
            });
        };

        data.forEach((thisOrderProduct) => {
            if (duplicates.indexOf(thisOrderProduct.product_id) >= 0) {
                const findItem = output.filter(
                    (item) => item.productId == parseInt(thisOrderProduct.product_id)
                );
                if (findItem.length) {
                    findItem[0].qty += thisOrderProduct.quantity;
                } else {
                    addItem(thisOrderProduct);
                }
            } else {
                addItem(thisOrderProduct);
            }
        });

        return output;
    }

    serializeSingleProductInCart_ORDER(data: apiOrderProductResponse): OrderProduct {
        const productInCart: OrderProduct = {
            productId: parseInt(data["product_id"]),
            qty: data["quantity"]
        };
        return productInCart;
    }
}

class Routes {
    private API_URL = "http://localhost:3000";

    private ORDER_ROUTES = {
        ["orderByUser"]: ":API_URL/orderbyuser/:userId",
        ["createOrder"]: ":API_URL/orders/:userId",
        ["addProduct"]: ":API_URL/orders/:orderId/products",
        ["productsInCart"]: ":API_URL/orders/:orderId/products"
    };

    private USER_ROUTES = {
        ["authenticate"]: ":API_URL/users/authenticate"
    };

    private PRODUCT_ROUTES = {
        ["allProducts"]: ":API_URL/products"
    };

    private options: Options = {
        API_URL: this.API_URL
    };

    allProducts(): string {
        const url = this.replaceUrl(this.PRODUCT_ROUTES.allProducts, this.options);
        return url;
    }

    authenticateUser(): string {
        const url = this.replaceUrl(this.USER_ROUTES.authenticate, this.options);
        return url;
    }

    orderByUser(userId: number): string {
        const options = Object.assign({}, this.options, { userId });
        const url = this.replaceUrl(this.ORDER_ROUTES.orderByUser, options);
        return url;
    }

    createOrder(userId: number): string {
        const options = Object.assign({}, this.options, { userId });
        const url = this.replaceUrl(this.ORDER_ROUTES.createOrder, options);
        return url;
    }

    addProduct(orderId: number): string {
        const options = Object.assign({}, this.options, { orderId });
        const url = this.replaceUrl(this.ORDER_ROUTES.addProduct, options);
        return url;
    }

    productsInCart(orderId: number): string {
        const options = Object.assign({}, this.options, { orderId });
        const url = this.replaceUrl(this.ORDER_ROUTES.productsInCart, options);
        return url;
    }

    private replaceUrl(url: string, options: Options): string {
        var regex = new RegExp(":(" + Object.keys(options).join("|") + ")", "g");

        return url.replace(regex, (m, $1) => options[$1] || m);
    }
}

interface Options {
    [index: string]: string;
}

export type LoginRequest = {
    username: string;
    password: string;
};

export type apiResponse = {
    success: boolean;
    data?: any;
    error?: Error;
    message?: string;
};

export type apiUser = {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
};

export type Order = {
    id: number;
    userId: string;
    status: string;
};

export type addProductRequest = {
    product_id: number;
    quantity: number;
};

export type apiOrderProductResponse = {
    order_id: string;
    product_id: string;
    quantity: number;
};

export type OrderProduct = {
    productId: number;
    qty: number;
};
