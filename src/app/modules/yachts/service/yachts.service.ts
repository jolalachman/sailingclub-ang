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

export type EditYachtRequest = {
    id: number;
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

export type ChangeStatusRequest = {
    id: number,
    status: string;
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

    editYacht(yacht: EditYachtRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'yacht'}`;
        return this.http.post<boolean>(url, yacht, {headers: this.getHeaders()});
    }

    deactivateYacht(yachtId: number): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'yacht'}/${'deactivate'}?yachtId=${yachtId}`;
        return this.http.post<boolean>(url, {headers: this.getHeaders()});
    }

    changeYachtStatus(changeStatus: ChangeStatusRequest): Observable<boolean> {
        const url = `${environment.apiUrl}${'v1'}/${'yacht'}/${'change-status'}`;
        return this.http.post<boolean>(url, changeStatus, {headers: this.getHeaders()});
    }
}