import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { HttpService } from "../shared/services/http.service";
import { LoginRequest } from "../shared/utilities/config";
import { LoginComponent } from "./login/login.component";

@Component({
    selector: "login-page",
    templateUrl: "./login-page.component.html",
    styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit, AfterViewInit {
    error = "";
    message = "";
    countDown = 0;

    @ViewChild(LoginComponent) loginComp: LoginComponent = {} as LoginComponent;

    constructor(private router: Router, private http: HttpService) {}

    ngOnInit(): void {
        // this.message = "test hello world...";
    }

    ngAfterViewInit() {
        // console.log(this.loginComp._inputEmail)
    }

    loginSubmitted(loginRequest: LoginRequest): void {
        /* reset any previous response messages */
        this.error = "";
        this.message = "";

        this.http.login(loginRequest).subscribe(
            (response) => {
                this.initSignIn(3000);
                this.loginComp.aform.resetForm();
            },
            (error) => this.showError(error)
        );
    }

    private initSignIn(countDown: number): void {
        this.countDown = countDown;
        setTimeout(() => {
            this.router.navigate([""]);
        }, this.countDown);
    }

    private showError(msg: string): void {
        this.error = msg;
        setTimeout(() => {
            this.error = "";
        }, 10000);
    }
}
