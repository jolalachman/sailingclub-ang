import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { ReservationShortDataModel } from "../../reservations/models/reservation.model";
import { DictionaryModel } from "src/app/shared/service/dictionary.service";
import { NoticeModel } from "../../notice-details/service/notice-details.service";
import { ChangeStatusRequest } from "../../yachts/service/yachts.service";

export type ReservationDetailsModel = {
    id: number;
    pickupDate: Date;
    dropoffDate: Date;
    yacht: DictionaryModel;
    yachtStatus: string;
    reservingPerson: DictionaryModel;
    clientInfo: DictionaryModel;
    currentStatus: DictionaryModel;
    photo: string;
    peopleNumber: number;
    canReportNotice: boolean;
    showPeopleNumberWarning: boolean;
};

export type ReservationStatusHistoryModel = {
    statusDate: Date;
    statusName: string;
}

export type ReportReservationNoticeModel = {
    reservationId: number;
    description: string;
}

export type ReservationNoticeModel = {
    id: number;
    reportedAt: Date;
    currentStatus: DictionaryModel;
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

    reportNotice(data: ReportReservationNoticeModel): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'report-notice'}`;
        return this.http.post<boolean>(url, data, {headers: this.getHeaders()});
    }

    getReservationReportedNotice(data: number): Observable<ReservationNoticeModel> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'reported-notice'}?reservationId=${data}`;
        return this.http.get<ReservationNoticeModel>(url, {headers: this.getHeaders()});
    }

    changeStatus(data: ChangeStatusRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'change-status'}`;
        return this.http.post<boolean>(url, data, {headers: this.getHeaders()});
    }

    giveReservation(data: number): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'give'}?reservationId=${data}`;
        return this.http.post<boolean>(url, data, {headers: this.getHeaders()});
    }

    completeReservation(data: number): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'reservations'}/${'complete'}?reservationId=${data}`;
        return this.http.post<boolean>(url, data, {headers: this.getHeaders()});
    }

}