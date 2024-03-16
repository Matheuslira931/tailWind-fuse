import {Injectable} from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {BrandingProcessHistory, Process, ProcessList} from "./magazines-and-dispatches.types";
import {PROCESS_ROUTE} from "../../shared/constants/path-constants";
import {Observable, Subject} from "rxjs";
import {ProcessHistory} from "../movement/movement.model";
import {HttpParams} from "@angular/common/http";
import {Page} from "../../shared/models/page.model";
import {ServiceOrderList} from "../service-orders/service-orders.types";
import {MARCAS} from "../../shared/constants/routes-constants";

@Injectable({providedIn: 'root'})
export class MagazinesAndDispatchesService extends BaseService<ProcessList, Process> {

    private fullscreen$ = new Subject<void>();

    constructor() {
        super(PROCESS_ROUTE);
    }

    getFullscreen$(): Observable<void> {
        return this.fullscreen$.asObservable();
    }

    emitFullScreen(): void {
        this.fullscreen$.next();
    }

    getDetails(id: number): Observable<Process> {
        return this.httpClient.get<Process>(`${this.getUrl()}${id}`);
    }

    getHistory(id: number): Observable<BrandingProcessHistory[]> {
        return this.httpClient.get<BrandingProcessHistory[]>(`${this.getUrl()}history/${id}`);
    }

    getHistoryById(id: number, movementType: number): Observable<ProcessHistory> {
        return this.httpClient.get<ProcessHistory>(`${this.getUrl()}history/movement/${id}?type=${movementType}`);
    }

    deleteHistory(id: number, movementType: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.getUrl()}/history/movement/${id}?type=${movementType}`);
    }

    filterByCollaborator(personCollaboratorId: number): Observable<any> {
        const params = new HttpParams({fromObject: {PersonCollaboratorId: personCollaboratorId}});
        return this.httpClient.get<Page<ServiceOrderList>>(`${this.getUrl()}itemspaged`, {params});
    }

    getRootPath(): string {
        return MARCAS;
    }
}
