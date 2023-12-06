import { HttpHeaders } from "@angular/common/http";

export abstract class ApiService {
    protected getHeaders(
        options?: {
            [name: string]: string | number;
        }
    ): HttpHeaders {
        return new HttpHeaders({
            ...{ 'Content-Type': 'application/json'},
            ...options,
        })
    }
}