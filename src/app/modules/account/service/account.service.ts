import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { LoginService } from "src/app/core/service/login/login.service";

export type UserResponse = {
    firstName: string;
    lastName: string;
    phone: string;
    clubStatus: string;
    sailingLicense: string;
}
export type UserRequest = {
    id: string
    firstName: string;
    lastName: string;
    phone: string;
    clubStatus: string;
    sailingLicense: string;
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
        const url = `${environment.apiUrl}${'v1'}/${'user'}?userId=${data.id}`;
        return this.http.patch<UserResponse>(url, data, {headers: this.getHeaders()});
    }
}