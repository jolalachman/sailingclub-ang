import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { ReportedNoticesPageModel } from "../models/reported-notice.model";

@Injectable({
    providedIn: 'root',
})
export class ReportedNoticesService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    all(): Observable<ReportedNoticesPageModel> {
        const url = `${environment.apiUrl}${'v1'}/${'notices'}/${'all'}`;
        return this.http.get<ReportedNoticesPageModel>(url, {headers: this.getHeaders()});
    }
}