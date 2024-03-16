import {Injectable} from '@angular/core';
import {City} from '../../models/city.model';
import {Observable, of, tap} from "rxjs";
import {RecordsBaseService} from "../records-base.service";
import {CITY_ROUTE} from "../../constants/path-constants";

@Injectable({
    providedIn: 'root',
})
export class CityService extends RecordsBaseService<City, City> {
    private cities: City[];

    constructor() {
        super(CITY_ROUTE);
    }

    getByStateId(stateId: number): Observable<City[]> {
        return this.httpClient.get<City[]>(`${this.getUrl()}items?stateId=${stateId}`);
    }

    getAll(): Observable<City[]> {
        return super.getAll().pipe(tap(cities => this.cities = cities));
    }

    getAllForAutoComplete(stateId: number, value?: string | City): Observable<City[]> {
        if (value === '') {
            return of(this.cities);
        }

        if (value instanceof Object) {
            const filter = this.cities.filter(country => country === value);
            return of(filter);
        }

        if (!!value && value !== '') {
            const filteredCountry = this.cities
                .filter(country => country.nome.toLowerCase().startsWith(value.toLowerCase()));
            return of(filteredCountry);
        }

        return this.httpClient.get<City[]>(`${this.getUrl()}items?stateId=${stateId}`)
            .pipe(tap((cities) => {
                this.cities = cities;
            }));
    }
}
