import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class RecordsBaseService<T, L> {
    httpClient: HttpClient;
    private readonly BASE_URL = environment.URL_API;
    private readonly BASE_API: string;

    constructor(baseApi: string) {
        this.BASE_API = baseApi;
        this.httpClient = inject(HttpClient);
    }

    getUrl(): string {
        return `${this.BASE_URL}${this.BASE_API}`;
    }

    getAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.BASE_URL}${this.BASE_API}items`);
    }

    getById(id: number): Observable<L> {
        return this.httpClient.get<L>(`${this.BASE_URL}${this.BASE_API}${id}`);
    }
}
