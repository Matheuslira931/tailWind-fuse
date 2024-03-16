import { Injectable } from '@angular/core';
import { PERSONS_ROUTE } from "../../shared/constants/path-constants";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { Page } from "../../shared/models/page.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Person, PersonList } from "./customers.types";

@Injectable({providedIn: 'root'})
export class PeopleService {
    private readonly BASE_URL_V2 = environment.URL_API_v2;

    constructor(private httpClient: HttpClient) {
    }

    getURL(): string {
        return `${this.BASE_URL_V2}${PERSONS_ROUTE}`;
    }

    getItemsPaged(page = 1, size = 50): Observable<Page<PersonList>> {
        const params = new HttpParams({fromObject: {PageNumber: page, PageSize: size}});
        return this.httpClient.get<Page<PersonList>>(`${this.getURL()}itemspaged?Types=1&Types=2`, {params});
    }

    getById(url: number): Observable<Person> {
        return this.httpClient.get<Person>(`${this.getURL()}${url}`);
    }
}
