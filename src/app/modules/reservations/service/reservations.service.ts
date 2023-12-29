import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { ReservationsPageModel } from "../models/reservation.model";

export type ReservationRequest = {
    pickup: string;
    dropoff: string;
    peopleNumber: number;
    reservingPersonId: string;
    userId: number;
    yachtId: number;
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
}