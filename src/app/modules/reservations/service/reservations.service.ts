import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { FiltersModel, ReservationsPageModel } from "../models/reservation.model";

export type ReservationRequest = {
    pickup: string;
    dropoff: string;
    peopleNumber: number;
    reservingPerson: string;
    userId: number;
    yachtId: number;
}

export type DictionaryModel = {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class ReservationsService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    all(): Observable<ReservationsPageModel> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}`;
        return this.http.get<ReservationsPageModel>(url, {headers: this.getHeaders()});
    }

    addReservation(reservation: ReservationRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}`;
        return this.http.post<boolean>(url, reservation, {headers: this.getHeaders()});
    }

    addYachtReservation(reservation: ReservationRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'add'}`;
        return this.http.post<boolean>(url, reservation, {headers: this.getHeaders()});
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
}