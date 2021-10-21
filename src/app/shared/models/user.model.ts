import { Injectable } from "@angular/core";

@Injectable()
export class User {
    constructor() {}

    id!: number;
    username: string = "";
    firstname: string = "";
    lastname: string = "";

    get isLoggedIn(): boolean {
        return !!this.id;
    }
}
