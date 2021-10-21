import { Observable, of, BehaviorSubject, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { apiUser } from "../utilities/config";
import { HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";

@Injectable()
export class Auth {
    private readonly JWT_TOKEN = "JWT_TOKEN";
    private loggedUserToken = "";

    public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private user: User) {}

    doLoginUser(token: string): void {
        // localStorage.setItem(this.JWT_TOKEN, token);
        this.loggedUserToken = token;
    }

    doLogoutUser(): void {
        // localStorage.removeItem(this.JWT_TOKEN);
        this.loggedUserToken = "";
    }

    getToken() {
        // return localStorage.getItem(this.JWT_TOKEN);
        return this.loggedUserToken;
    }

    getCurrentUser(): Observable<apiUser> {
        const token = this.getToken();
        if (token) {
            const encodedPayload = token.split(".")[1];
            const payload = window.atob(encodedPayload);
            return of(JSON.parse(payload)?.user as apiUser);
        } else {
            return throwError(new Error("no user available"));
        }
    }

    initUser(token: string): void {
        if (token) {
            const encodedPayload = token.split(".")[1];
            const payload = window.atob(encodedPayload);
            const apiuser = JSON.parse(payload)?.user as apiUser;

            this.user.id = apiuser.id;
            this.user.username = apiuser.username;
            this.user.firstname = apiuser.firstname;
            this.user.lastname = apiuser.lastname;
        }
    }

    getAuthorizationHeader(): HttpHeaders {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken()}`
        });
        return headers;
    }
}
