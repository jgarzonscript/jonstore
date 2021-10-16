import { Observable, of, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { User } from "../utilities/config";

@Injectable()
export class Auth {
    private readonly JWT_TOKEN = "JWT_TOKEN";
    private loggedUserToken = "";

    public isUserLoggedIn: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    doLoginUser(token: string): void {
        // localStorage.setItem(this.JWT_TOKEN, token);
        this.loggedUserToken = token;
        this.isUserLoggedIn.next(true);
    }

    doLogoutUser(): void {
        // localStorage.removeItem(this.JWT_TOKEN);
        this.loggedUserToken = "";
    }

    getToken() {
        // return localStorage.getItem(this.JWT_TOKEN);
        return this.loggedUserToken;
    }

    getCurrentUser(): Observable<User | undefined> {
        const token = this.getToken();
        if (token) {
            const encodedPayload = token.split(".")[1];
            const payload = window.atob(encodedPayload);
            return of(JSON.parse(payload)?.user);
        } else {
            return of(undefined);
        }
    }
}
