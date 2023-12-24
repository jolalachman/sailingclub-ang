import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { YachtReservation } from "../../yachts/models/yacht.model";

export type YachtModel = {
    name: string;
    type: string;
    registrationNumber: string;
    currentStatus: string;
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
    reservations: YachtReservation[];
    dailyPrice: number;
    hourlyPrice: number;
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
}