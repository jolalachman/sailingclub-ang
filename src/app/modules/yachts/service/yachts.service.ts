import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";
import { FiltersModel, YachtsPageModel } from "../models/yacht.model";

export type YachtRequest = {
    name: string;
    type: string;
    registrationNumber: string;
    description: string;
    photo: string;
    length: number;
    width: number;
    immersion: number;
    sailArea: number;
    maxPeople: number;
    cabinNumber: number;
    shower: boolean;
    wc: boolean;
    microwave: boolean;
    radio: boolean;
    dailyPrice: number;
    hourlyPrice: number;
}

@Injectable({
    providedIn: 'root',
})
export class YachtsService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    all(): Observable<YachtsPageModel> {
        const url = `${environment.apiUrl}${'v1'}/${'yachts'}`;
        return this.http.get<YachtsPageModel>(url, {headers: this.getHeaders()});
    }

    addYacht(yacht: YachtRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'yachts'}`;
        return this.http.post<boolean>(url, yacht, {headers: this.getHeaders()});
    }
}