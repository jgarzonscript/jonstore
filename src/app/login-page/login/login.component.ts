import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    _inputEmail = "";
    _inputPass = "";
    @Output() loginData = new EventEmitter();

    constructor(private router: Router) {}

    ngOnInit(): void {}

    onSubmit(): void {
        const data = { username: this._inputEmail, password: this._inputPass };
        this.loginData.emit(data);
        // this.router.navigate(["login", 333]);
        // console.log("submit clicked");
    }
}
