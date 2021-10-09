import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

@Component({
    selector: "login-page",
    templateUrl: "./login-page.component.html",
    styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    loginSubmitted(data: object): void {
        console.log(data);
    }
}
