import { Component, OnInit } from "@angular/core";
import { Product } from "../shared/models/product.model";
import { HttpService } from "../shared/services/http.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Order, User } from "../shared/utilities/config";
import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    private user!: User;
    private user$: Subject<User> = new ReplaySubject<User>(1);
    private order!: Order;
    //public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpService, private router: Router) {}

    ngOnInit(): void {
        this.http.getProducts().subscribe((data) => (this.products = data));
        this.initUserInfo();
        this.initOrders();
        console.log(`userid: ${this.user?.id}`);
    }

    private initUserInfo(): void {
        this.http.isLoggedIn$().subscribe((isUserLoggedIn) => {
            if (!this.user && isUserLoggedIn && this.router.url === "/") {
                this.http.getCurrentUser$().subscribe((user) => {
                    this.user$.next(user);
                    this.user = user;
                    console.log("inside here");
                });
            }
        });
    }

    private initOrders(): void {
        this.user$.subscribe((user) => {
            this.http.getActiveOrder(this.user.id).subscribe(
                (data) => {
                    console.log(`active order: ${data}`);
                },
                (error) => {
                    // an active order did not exist so create one...
                    this.http
                        .createOrder(this.user.id)
                        .subscribe((order) => (this.order = order));
                }
            );
        });
    }
}
