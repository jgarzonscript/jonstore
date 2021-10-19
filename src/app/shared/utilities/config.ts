import { Injectable } from "@angular/core";

@Injectable()
export class Config {
    routes!: Routes;

    constructor() {
        this.routes = new Routes();
    }

    private API_URL = "http://localhost:3000";

    private ROUTES = {
        ["orderByUser"]: `${this.API_URL}/orderbyuser`,
        ["createOrder"]: ":API_URL/orders/:userId"
    };

    private options: Options = {
        API_URL: this.API_URL
    };

    // To-Do: deprecate this
    get apiUrl(): string {
        return this.API_URL;
    }

    // orderByUser(userId: number): string {
    //     return `${this.ROUTES.orderByUser}/` + userId;
    // }

    // createOrder(userId: number): string {
    //     const options = Object.assign({}, this.options, { userId });
    //     const url = this.replaceUrl(this.ROUTES.createOrder, options);
    //     return url;
    // }

    // private replaceUrl(url: string, options: Options): string {
    //     var regex = new RegExp(":(" + Object.keys(options).join("|") + ")", "g");

    //     return url.replace(regex, (m, $1) => options[$1] || m);
    // }

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

    private options: Options = {
        API_URL: this.API_URL
    };

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
