import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { AlertType } from "./alert.types";


@Injectable({providedIn: 'root'})
export class AlertService {
    private _alert = new ReplaySubject<AlertType>();

    getAlert$(): Observable<AlertType> {
        return this._alert.asObservable();
    }

    show(type: AlertType): void {
        this._alert.next(type);
    }
}
