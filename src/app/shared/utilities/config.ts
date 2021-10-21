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
}

class Routes {
    private API_URL = "http://localhost:3000";

    private ORDER_ROUTES = {
        ["orderByUser"]: ":API_URL/orderbyuser/:userId",
        ["createOrder"]: ":API_URL/orders/:userId"
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

export type User = {
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
