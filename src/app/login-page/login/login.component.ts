import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    _inputEmail = "";
    _inputPass = "";

    @ViewChild("f") aform: NgForm = {} as NgForm;

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
