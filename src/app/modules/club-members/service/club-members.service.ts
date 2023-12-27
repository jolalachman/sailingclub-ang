import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { ClubMembersPageModel } from "../models/club-member.model";

@Injectable({
    providedIn: 'root',
})
export class ClubMembersService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    all(): Observable<ClubMembersPageModel> {
        const url = `${environment.apiUrl}${'v1'}/${'users'}/${'club-members'}`;
        return this.http.get<ClubMembersPageModel>(url, {headers: this.getHeaders()});
    }

    // addYacht(yacht: YachtRequest): Observable<boolean> {
    //     const url = `${environment.apiUrl}${'v1'}/${'yachts'}`;
    //     return this.http.post<boolean>(url, yacht, {headers: this.getHeaders()});
    // }

    // editYacht(yacht: EditYachtRequest): Observable<boolean> {
    //     const url = `${environment.apiUrl}${'v1'}/${'yacht'}`;
    //     return this.http.post<boolean>(url, yacht, {headers: this.getHeaders()});
    // }

    // deactivateYacht(yachtId: number): Observable<boolean> {
    //     const url = `${environment.apiUrl}${'v1'}/${'yacht'}/${'deactivate'}?yachtId=${yachtId}`;
    //     return this.http.post<boolean>(url, {headers: this.getHeaders()});
    // }

    // changeYachtStatus(changeStatus: ChangeStatusRequest): Observable<boolean> {
    //     const url = `${environment.apiUrl}${'v1'}/${'yacht'}/${'change-status'}`;
    //     return this.http.post<boolean>(url, changeStatus, {headers: this.getHeaders()});
    // }
}