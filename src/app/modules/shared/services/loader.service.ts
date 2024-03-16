import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class LoaderService {
    private _toggle = new ReplaySubject<void>();

    toggle$(): Observable<void> {
        return this._toggle.asObservable();
    }

    toggle(): void {
        return this._toggle.next();
    }
}
