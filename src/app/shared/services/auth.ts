import { Observable, of, BehaviorSubject, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { User } from "../utilities/config";
import { HttpHeaders } from "@angular/common/http";

@Injectable()
export class Auth {
    private readonly JWT_TOKEN = "JWT_TOKEN";
    private loggedUserToken = "";

    public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

    getCurrentUser(): Observable<User> {
        const token = this.getToken();
        if (token) {
            const encodedPayload = token.split(".")[1];
            const payload = window.atob(encodedPayload);
            return of(JSON.parse(payload)?.user as User);
        } else {
            return throwError(new Error("no user available"));
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
