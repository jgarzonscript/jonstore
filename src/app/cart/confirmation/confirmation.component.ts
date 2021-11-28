import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "cart-confirmation",
    templateUrl: "./confirmation.component.html",
    styleUrls: ["./confirmation.component.css"]
})
export class ConfirmationComponent implements OnInit {
    cName = "";
    cartTotal = 0;

    constructor(private route: ActivatedRoute, private r: Router) {}

    ngOnInit(): void {
        const cName = <string>this.route.snapshot.paramMap.get("name"),
            cartTotalString = <string>this.route.snapshot.paramMap.get("total");
        this.cName = cName;
        this.cartTotal = parseFloat(cartTotalString);
    }

    reDirect(): void {
        this.r.navigate([""]);
    }
}
