import {Injectable} from '@angular/core';
import {Observable, of, tap} from 'rxjs';
import {Country} from '../../models/country.model';
import {RecordsBaseService} from "../records-base.service";
import {COUNTRY_ROUTE} from "../../constants/path-constants";

@Injectable({
    providedIn: 'root'
})
export class CountryService extends RecordsBaseService<Country, Country> {
    private countries: Country[];

    constructor() {
        super(COUNTRY_ROUTE);
    }

    getByStateId(countryId: number): Observable<Country> {
        return this.httpClient.get<Country>(`${this.getUrl()}stateid/${countryId}`);
    }

    getAll(value?: string | Country): Observable<Country[]> {
        if (value === '') {
            return of(this.countries);
        }

        if (value instanceof Object) {
            const filter = this.countries.filter(country => country === value);
            return of(filter);
        }

        if (!!value && value !== '') {
            const filteredCountry = this.countries
                .filter(country => country.nome.toLowerCase().startsWith(value.toLowerCase()));
            return of(filteredCountry);
        }

        return this.httpClient.get<Country[]>(`${this.getUrl()}items`)
            .pipe(tap((countries) => {
                this.countries = countries;
            }));
    }
}
