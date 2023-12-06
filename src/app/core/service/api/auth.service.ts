import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";

export type TokenResponse = {
    token: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    login(data: LoginRequest): Observable<TokenResponse> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'authenticate'}`;
        return this.http.post<TokenResponse>(url, data, {headers: this.getHeaders()});
    }

    register(data: RegisterRequest): Observable<TokenResponse> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'register'}`;
        return this.http.post<TokenResponse>(url, data, {headers: this.getHeaders()});
    }
}