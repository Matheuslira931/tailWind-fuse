import { Injectable } from '@angular/core';
import { MovementList, ProcessHistory } from './movement.model';
import { BaseService } from "../../shared/services/base.service";
import { MOVEMENTS_ROUTE } from "../../shared/constants/path-constants";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class MovementService extends BaseService<MovementList, ProcessHistory> {

    constructor() {
        super(MOVEMENTS_ROUTE);
    }

    getMovementsByType(movementType: 1 | 2 | 3): Observable<MovementList[]> {
        return this.httpClient.get<MovementList[]>(`${this.getUrl()}items/${movementType}`);
    }

    getRootPath(): string {
        return null;
    }
}
