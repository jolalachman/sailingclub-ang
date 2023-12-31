import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { YachtDetailsReservation, YachtReservation } from "../../yachts/models/yacht.model";
import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type YachtModel = {
    id: number;
    name: string;
    type: DictionaryModel;
    registrationNumber: string;
    currentStatus: DictionaryModel;
    photo: string;
    description: string;
    technicalData: {
        length: number;
        width: number;
        immersion: number;
        sailArea: number;
        maxPeople: number;
        cabinNumber: number;
    }
    equipment: {
        shower: boolean;
        wc: boolean;
        microwave: boolean;
        radio: boolean;
    }
    reservations: YachtDetailsReservation[];
    dailyPrice: number;
    hourlyPrice: number;
}

export type YachtStatusHistoryModel = {
    statusDate: Date;
    statusName: string;
}

@Injectable({
    providedIn: 'root',
})
export class YachtDetailsService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    getYacht(id: number): Observable<YachtModel> {
        const url = `${environment.apiUrl}${'v1'}/${'yacht'}?yachtId=${id}`;
        return this.http.get<YachtModel>(url, {headers: this.getHeaders()});
    }

    getYachtStatusesHistory(id: number): Observable<YachtStatusHistoryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'yacht'}/${'history'}?yachtId=${id}`;
        return this.http.get<YachtStatusHistoryModel[]>(url, {headers: this.getHeaders()});
    }
}