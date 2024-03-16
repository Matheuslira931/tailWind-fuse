import {Injectable} from '@angular/core';
import {ServiceOrderList} from './service-orders.types';
import {BaseService} from "../../shared/services/base.service";
import {SERVICE_ORDER_ROUTE} from "../../shared/constants/path-constants";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {Page} from "../../shared/models/page.model";
import {ORDENS_DE_SERVICO} from "../../shared/constants/routes-constants";

@Injectable({providedIn: 'root'})
export class ServiceOrdersService extends BaseService<ServiceOrderList, ServiceOrderList> {

    constructor() {
        super(SERVICE_ORDER_ROUTE);
    }

    filterByCollaborator(personCollaboratorId: number): Observable<any> {
        const params = new HttpParams({fromObject: {PersonCollaboratorId: personCollaboratorId}});
        return this.httpClient.get<Page<ServiceOrderList>>(`${this.getUrl()}itemspaged`, {params});
    }

    getRootPath(): string {
        return ORDENS_DE_SERVICO;
    }
}
