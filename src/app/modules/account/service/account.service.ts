import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { LoginService } from "src/app/core/service/login/login.service";
import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type UserResponse = {
    firstName: string;
    lastName: string;
    phone: string;
    clubStatus: string;
    sailingLicense: DictionaryModel;
}
export type UserRequest = {
    id: string
    firstName: string;
    lastName: string;
    phone: string;
    clubStatus: string;
    sailingLicenseId: number;
}

export type ChangePasswordRequest = {
    id: string;
    oldPassword: string;
    newPassword: string;
}

@Injectable({
    providedIn: 'root',
})
export class AccountService extends ApiService {
    constructor(private http: HttpClient, private loginService: LoginService) {
        super();
    }

    getAccount(data: string): Observable<UserResponse> {
        const url = `${environment.apiUrl}${'v1'}/${'user'}?userId=${data}`;
        return this.http.get<UserResponse>(url, {headers: this.getHeaders()});
    }

    editAccount(data: UserRequest): Observable<UserResponse> {
        const url = `${environment.apiUrl}${'v1'}/${'user'}`;
        return this.http.post<UserResponse>(url, data, {headers: this.getHeaders()});
    }

    changePassword(data: ChangePasswordRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'user'}/${'changePassword'}`;
        return this.http.post<boolean>(url, data, {headers: this.getHeaders()});
    }
}