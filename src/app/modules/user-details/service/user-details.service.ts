import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { UserDetailsReservation } from "../../users/models/user.model";
import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type UserModel = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: DictionaryModel;
    clubStatus: string;
    sailingLicense: DictionaryModel;
    reservations: UserDetailsReservation[];
}

export type EditUserRequest = {
    id: number;
    firstName: string,
    lastName: string,
    role: number,
    clubStatus: string,
    sailingLicense: number,
}

@Injectable({
    providedIn: 'root',
})
export class UserDetailsService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    getUser(data: number): Observable<UserModel> {
        const url = `${environment.apiUrl}${'v1'}/${'user'}/${'details'}?userId=${data}`;
        return this.http.get<UserModel>(url, {headers: this.getHeaders()});
    }

    deactivateUser(userId: number): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'user'}/${'deactivate'}?userId=${userId}`;
        return this.http.post<boolean>(url, {headers: this.getHeaders()});
    }

    editUser(request: EditUserRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'user'}/${'edit'}`;
        return this.http.post<boolean>(url, request, {headers: this.getHeaders()}); 
    }

    validateCandidate(userId: number): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'user'}/${'validate'}?userId=${userId}`;
        return this.http.post<boolean>(url, {headers: this.getHeaders()});
    }
}