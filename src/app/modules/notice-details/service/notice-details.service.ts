import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { ReportedNoticeShortDataModel } from "../../notices/models/reported-notice.model";
import { DictionaryModel } from "../../auth/services/auth-dictionary.service";

export type NoticeEditModel = {
    id: number;
    description: string;
}

export type ChangeNoticeStatusModel = {
    id: number;
    statusId: number;
}

export type NoticeModel = {
    id: number;
    reportedAt: Date;
    yacht: DictionaryModel;
    reservationId: number;
    clubMember: DictionaryModel;
    currentStatus: DictionaryModel;
    description: string;
}

@Injectable({
    providedIn: 'root',
})
export class NoticeDetailsService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    getNotice(data: number): Observable<NoticeModel> {
        const url = `${environment.apiUrl}${'v1'}/${'notices'}/${'details'}?noticeId=${data}`;
        return this.http.get<NoticeModel>(url, {headers: this.getHeaders()});
    }

    changeNoticeStatus(request: ChangeNoticeStatusModel): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'notices'}/${'change-status'}`;
        return this.http.post<boolean>(url, request, {headers: this.getHeaders()});
    }

    editNotice(request: NoticeEditModel): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'notices'}/${'edit'}`;
        return this.http.post<boolean>(url, request, {headers: this.getHeaders()}); 
    }
}