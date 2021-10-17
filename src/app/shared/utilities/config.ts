import { Injectable } from "@angular/core";

@Injectable()
export class Config {
    private API_URL = "http://localhost:3000";

    get apiUrl(): string {
        return this.API_URL;
    }
}

export type LoginRequest = {
    username: string;
    password: string;
};

export type apiResponse = {
    success: boolean;
    data?: any;
    error?: Error;
    message?: string;
};

export type User = {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
};
