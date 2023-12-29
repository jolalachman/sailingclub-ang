import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { FiltersModel, MyReservationsPageModel } from "../models/my-reservation.model";

export type MyReservationRequest = {
    pickup: string;
    dropoff: string;
    peopleNumber: number;
    reservingPerson: string;
    userId: number;
    yachtId: number;
}

@Injectable({
    providedIn: 'root',
})
export class MyReservationsService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    all(userId: string): Observable<MyReservationsPageModel> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'my'}?userId=${userId}`;
        return this.http.get<MyReservationsPageModel>(url, {headers: this.getHeaders()});
    }

}