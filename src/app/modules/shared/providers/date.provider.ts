import {LOCALE_ID, Provider} from "@angular/core";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

export const DateProvider: Provider[] = [
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {
        provide: MAT_DATE_FORMATS, useValue: {
            parse: {
                dateInput: 'L',
            },
            display: {
                dateInput: 'L',
                monthYearLabel: 'MMM YYYY',
                dateA11yLabel: 'LL',
                monthYearA11yLabel: 'MMMM YYYY',
            },
        }
    },
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
]
