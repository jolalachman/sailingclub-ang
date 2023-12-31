import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { ReservationShortDataModel } from "../../reservations/models/reservation.model";
import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type ReservationDetailsModel = {
    id: number;
    pickupDate: Date;
    dropoffDate: Date;
    yacht: DictionaryModel;
    reservingPerson: DictionaryModel;
    clientInfo: DictionaryModel;
    currentStatus: DictionaryModel;
    photo: string;
    peopleNumber: number;
    canReportNotice: boolean;
};

export type ReservationStatusHistoryModel = {
    statusDate: Date;
    statusName: string;
}

@Injectable({
    providedIn: 'root',
})
export class ReservationDetailsService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    getReservation(data: number): Observable<ReservationDetailsModel> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'details'}?reservationId=${data}`;
        return this.http.get<ReservationDetailsModel>(url, {headers: this.getHeaders()});
    }

    getReservationStatusesHistory(id: number): Observable<ReservationStatusHistoryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'history'}?reservationId=${id}`;
        return this.http.get<ReservationStatusHistoryModel[]>(url, {headers: this.getHeaders()});
    }
}