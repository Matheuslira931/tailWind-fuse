import {Component, Input, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {NgForOf, TitleCasePipe} from "@angular/common";
import {AbstractControl, ReactiveFormsModule, UntypedFormGroup} from "@angular/forms";
import {Country} from "../../models/country.model";
import {State} from "../../models/state.model";
import {City} from "../../models/city.model";
import {CountryService} from "../../services/country/country.service";
import {CityService} from "../../services/city/city.service";
import {StateService} from "../../services/state/state.service";
import {catchError, debounceTime, EMPTY, filter, finalize, switchMap, throwError} from "rxjs";
import {
    BAIRRO_FORM_PATH,
    CITY_FORM_PATH,
    COMPLEMENTO_FORM_PATH,
    COUNTRY_FORM_PATH,
    ENDERECO_FORM_PATH,
    STATE_FORM_PATH
} from "../../../admin/customers/customers-forms.constants";

@Component({
    selector: 'app-address-info',
    templateUrl: './complete-address-info.component.html',
    imports: [
        MatButtonModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        NgForOf,
        ReactiveFormsModule,
        TitleCasePipe
    ],
    standalone: true
})
export class CompleteAddressInfoComponent implements OnInit {
    @Input() form: UntypedFormGroup;
    @Input() cityId: number;

    countries: Country[] = [];
    states: State[] = [];
    cities: City[] = [];

    private loadedCountry: Country;
    private loadedState: State;

    constructor(private _countryService: CountryService,
                private _stateService: StateService,
                private _titleCasePipe: TitleCasePipe,
                private _cityService: CityService) {
    }

    ngOnInit(): void {
        this.setLocationsFromCityId();
        this.loadAutoCompletes();
        this.handleStringsCases();
    }

    private watchFormChanges(): void {
        this.watchCountryChanges();
        this.watchStateChanges();
        this.watchCityChanges();
    }

    private watchCountryChanges(): void {
        this.form.get(COUNTRY_FORM_PATH).valueChanges
            .pipe(switchMap((query: string | Country) => {
                if (query instanceof Object) {
                    this.clearSubLocations();
                    this._stateService.getByCountryId(query.id)
                        .subscribe(states => this.states = states);
                    return EMPTY;
                }
                return this._countryService.getAll(query);
            }))
            .subscribe((countries: Country[]) => this.countries = countries);
    }


    private watchCityChanges(): void {
        this.form.get(CITY_FORM_PATH).valueChanges
            .pipe(switchMap((query: string | City) => {
                const state: State = this.form.get('estado').getRawValue();
                if (!state) {
                    return EMPTY;
                }
                return this._cityService.getAllForAutoComplete(state.id, query);
            }))
            .subscribe((cities: City[]) => {
                this.cities = cities;
            });
    }

    private watchStateChanges(): void {
        this.form.get(STATE_FORM_PATH).valueChanges
            .pipe(switchMap((query: string | State) => {
                const country: Country = this.form.get('pais').getRawValue();
                if (!country) {
                    return EMPTY;
                }

                if (query instanceof Object) {
                    const state = query as State;
                    this._cityService.getByStateId(state.id).subscribe(cities => {
                        this.form.get(CITY_FORM_PATH).setValue(undefined);
                        this.cities = cities;
                    });
                }

                return this._stateService.getAllForAutoComplete(country.id, query);
            }))
            .subscribe((states: State[]) => this.states = states);
    }

    private clearSubLocations(): void {
        this.form.get(STATE_FORM_PATH).setValue(undefined);
        this.form.get(CITY_FORM_PATH).setValue(undefined);
    }

    getName(value: Country): string {
        return value?.nome;
    }

    private loadAutoCompletes(): void {
        this._countryService.getAll().subscribe(countries => this.countries = countries);
    }

    private handleStringsCases(): void {
        this.transformToTitleCaseByFormControl(this.form.get(ENDERECO_FORM_PATH));
        this.transformToTitleCaseByFormControl(this.form.get(COMPLEMENTO_FORM_PATH));
        this.transformToTitleCaseByFormControl(this.form.get(BAIRRO_FORM_PATH));
    }

    private transformToTitleCaseByFormControl(formControl: AbstractControl): void {
        formControl?.valueChanges?.pipe(
            debounceTime(250),
            filter(Boolean)
        ).subscribe(value => {
            const transformedValue = this._titleCasePipe.transform(value);
            formControl?.setValue(transformedValue);
        });
    }

    private setLocationsFromCityId(): void {
        if (!this.cityId) {
            this.watchFormChanges();
            return;
        }

        this._stateService.getByCityId(this.cityId)
            .pipe(
                catchError((err) => throwError(err)),
                filter(Boolean),
                switchMap((state: State) => {
                    this.loadedState = state;
                    return this._countryService.getByStateId(state.id);
                }),
                catchError((err) => throwError(err)),
                switchMap(country => {
                    this.loadedCountry = country;
                    return this._cityService.getById(this.cityId);
                }),
                finalize(() => {
                    this.watchFormChanges();
                })
            )
            .subscribe((city: City) => {
                this.form.get(COUNTRY_FORM_PATH).setValue(this.loadedCountry);
                this.form.get(STATE_FORM_PATH).setValue(this.loadedState);
                this.form.get(CITY_FORM_PATH).setValue(city);
            });
    }
}
