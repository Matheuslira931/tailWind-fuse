import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class SettingsService {
    private toggle$ = new ReplaySubject<void>();

    getToggle$(): Observable<void> {
        return this.toggle$.asObservable();
    }

    toggle(): void {
        this.toggle$.next();
    }
}
