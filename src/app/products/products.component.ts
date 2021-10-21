import { Component, OnInit } from "@angular/core";
import { Product } from "../shared/models/product.model";
import { HttpService } from "../shared/services/http.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Order } from "../shared/utilities/config";
import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import { User } from "../shared/models/user.model";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    private order!: Order;

    // private user$: Subject<User> = new ReplaySubject<User>(1);

    //public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpService, private router: Router, private user: User) {}

    ngOnInit(): void {
        this.http.getProducts().subscribe((data) => (this.products = data));
        this.initOrders();
        console.log(`user id: ` + this.user.id);
    }

    private initOrders(): void {
        if (this.user.isLoggedIn) {
            this.http.getActiveOrder$(this.user.id).subscribe((order) => {
                console.log(
                    `inside initOrders() calling getActiveOrder$, ` +
                        JSON.stringify(order)
                );
                this.order = order;
            });
        }
    }
}
