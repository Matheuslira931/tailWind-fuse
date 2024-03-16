import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {MaritalStatus} from "../../models/marital-status.model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ServiceOrderService extends BaseService<MaritalStatus, MaritalStatus> {

    constructor() {
        super('records/serviceorders/');
    }

    getAll(): Observable<MaritalStatus[]> {
        return this.httpClient.get<MaritalStatus[]>(`${this.getURL()}items`)
    }
}
