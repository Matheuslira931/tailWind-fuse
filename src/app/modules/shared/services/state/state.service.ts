import {Injectable} from '@angular/core';
import {State} from '../../models/state.model';
import {Observable, of, tap} from "rxjs";
import {RecordsBaseService} from "../records-base.service";
import {STATE_ROUTE} from "../../constants/path-constants";

@Injectable({
    providedIn: 'root'
})
export class StateService extends RecordsBaseService<State, State> {
    private states: State[];
    constructor() {
        super(STATE_ROUTE);
    }

    getByCountryId(countryId: number): Observable<State[]> {
        return this.httpClient.get<State[]>(`${this.getUrl()}items?countryId=${countryId}`);
    }

    getByCityId(cityId: number): Observable<State> {
        return this.httpClient.get<State>(`${this.getUrl()}cityid/${cityId}`);
    }

    getAll(): Observable<State[]> {
        return super.getAll().pipe(tap(states => this.states = states));
    }

    getAllForAutoComplete(countryId: number, value?: string | State): Observable<State[]> {
        if (value === '') {
            return of(this.states);
        }

        if (value instanceof Object) {
            const filter = this.states.filter(state => state === value);
            return of(filter);
        }

        if (!!value && value !== '') {
            const filteredCountry = this.states
                .filter(state => state.nome.toLowerCase().startsWith(value.toLowerCase()));
            return of(filteredCountry);
        }

        return this.httpClient.get<State[]>(`${this.getUrl()}items?countryId=${countryId}`)
            .pipe(tap((states) => {
                this.states = states;
            }));
    }
}
