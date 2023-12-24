import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";
import { ApiService } from "src/app/core/service/api/api.service";


export type DictionaryModel = {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthDictionaryService extends ApiService {
    constructor(private http: HttpClient) {
        super();
    }

    getSailingLicensesDictionary(): Observable<DictionaryModel[]> {
        const url = `${environment.apiUrl}${'v1'}/${'auth'}/${'sailingLicenses'}`;
        return this.http.get<DictionaryModel[]>(url, {headers: this.getHeaders()});
    }
}