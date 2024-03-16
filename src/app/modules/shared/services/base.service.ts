import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../models/page.model";

@Injectable({providedIn: 'root'})
export abstract class BaseService<T, L> {
    private readonly BASE_URL = environment.URL_API;
    private readonly BASE_API: string;
    httpClient: HttpClient;

    constructor(baseApi: string) {
        this.BASE_API = baseApi;
        this.httpClient = inject(HttpClient);
    }

    getUrl(): string {
        return `${this.BASE_URL}${this.BASE_API}`;
    }

    getItemsPaged(page = 1, size = 50): Observable<Page<T>> {
        const params = new HttpParams({fromObject: {PageNumber: page, PageSize: size}});
        return this.httpClient.get<Page<T>>(`${this.getUrl()}itemspaged`, {params});
    }

    fetchByParams(params: HttpParams): Observable<Page<T>> {
        return this.httpClient.get<Page<T>>(`${this.BASE_URL}${this.BASE_API}itemspaged`, {params});
    }

    getById(id: number): Observable<L> {
        return this.httpClient.get<L>(`${this.BASE_URL}${this.BASE_API}${id}`);
    }

    deleteById(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.BASE_URL}/records/positions?id=${id}`);
    }

    save(record: Partial<T>): Observable<T> {
        return this.httpClient.post<T>(`${this.BASE_URL}${this.BASE_API}`, record);
    }

    update(record: T): Observable<L> {
        return this.httpClient.put<L>(`${this.BASE_URL}${this.BASE_API}`, record);
    }

    search(query: string): Observable<Page<T>> {
        return this.httpClient.get<Page<T>>(`${this.BASE_URL}${this.BASE_API}itemspaged?geral=${query}`);
    }

    getURL(): string {
        return `${environment.URL_API}/${this.BASE_API}`;
    }

    getAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.BASE_URL}${this.BASE_API}itemspaged`);
    }

    abstract getRootPath(): string;
}
