import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";

export type LoginResponse = {
    auth_token: string;
    firstName: string;
    lastName: string;
    id: string;
    permission: string;
}

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
    clubStatus: string;
    sailingLicense: number;
    email: string;
    password: string;
}

export type RegisterByAdminRequest = {
    firstName: string;
    lastName: string;
    role: string;
    clubStatus: string;
    sailingLicense: number;
    email: string;
    password: string;
}

export type RecoverPasswordRequest = {
    email: string;
}

export type ResetPasswordRequest = {
    resetToken: string;
    newPassword: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    login(data: LoginRequest): Observable<LoginResponse> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'authenticate'}`;
        return this.http.post<LoginResponse>(url, data, {headers: this.getHeaders()});
    }

    register(data: RegisterRequest): Observable<TokenResponse> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'register'}`;
        return this.http.post<TokenResponse>(url, data, {headers: this.getHeaders()});
    }

    registerByAdmin(data: RegisterByAdminRequest): Observable<TokenResponse> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'register'}/${'admin'}`;
        return this.http.post<TokenResponse>(url, data, {headers: this.getHeaders()});
    }

    activateAccount(data: TokenResponse): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'confirmUser'}`;
        return this.http.patch<boolean>(url, data, {headers: this.getHeaders()});
    }

    recoverPassword(data: RecoverPasswordRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'recoverPassword'}`;
        return this.http.post<boolean>(url, data, {headers: this.getHeaders()});
    }

    resetPassword(data: ResetPasswordRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'resetPassword'}`;
        return this.http.post<boolean>(url, data, {headers: this.getHeaders()});
    }
}