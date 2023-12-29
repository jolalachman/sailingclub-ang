import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";


export type DictionaryModel = {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class DictionaryService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    getYachtsDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'yachts'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getAllYachtsDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'all-yachts'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getAllReservationsDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'all-reservations'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getUsersDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'users'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getClubMembersDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'club-members'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getReservingUsersDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'reserving-users'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getNoticeStatusesDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'notice-statuses'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getReservationStatusesDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'reservation-statuses'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getYachtStatusesDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'yacht-statuses'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getYachtTypesDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'yacht-types'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getUserRolesDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'dictionary'}/${'user-roles'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }

    getSailingLicensesDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'sailingLicenses'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }
}