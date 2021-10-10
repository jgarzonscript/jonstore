import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { HttpService } from "../shared/services/http.service";
import { LoginRequest } from "../shared/utilities/config";

@Component({
    selector: "login-page",
    templateUrl: "./login-page.component.html",
    styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
    constructor(private router: Router, private http: HttpService) {}

    ngOnInit(): void {}

    loginSubmitted(loginRequest: LoginRequest): void {
        this.http.login(loginRequest).subscribe((data) => {
            if (data?.success) {
                //
            }
        });
    }
}
