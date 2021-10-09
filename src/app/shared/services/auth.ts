export class Auth {
    private readonly JWT_TOKEN = "JWT_TOKEN";

    doLoginUser(token: string): void {
        localStorage.setItem(this.JWT_TOKEN, token);
    }

    doLogoutUser(): void {
        localStorage.removeItem(this.JWT_TOKEN);
    }

    getToken() {
        return localStorage.getItem(this.JWT_TOKEN);
    }
}
