import {Injectable} from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Customer, CustomerList, CustomerSearchByType} from "./customers.types";
import {CUSTOMER_ROUTE} from "../../shared/constants/path-constants";
import {Observable} from "rxjs";
import {Page} from "../../shared/models/page.model";
import {CLIENTES} from "../../shared/constants/routes-constants";

@Injectable({providedIn: 'root'})
export class CustomersService extends BaseService<CustomerList, Customer> {

    constructor() {
        super(CUSTOMER_ROUTE);
    }

    getAllByType(type: CustomerSearchByType): Observable<Page<CustomerList>> {
        const map = new Map([
            ['PF', 1],
            ['PJ', 2],
        ]);
        return this.httpClient.get<Page<CustomerList>>(`${this.getUrl()}itemspaged?type=${map.get(type)}`);
    }

    getRootPath(): string {
        return CLIENTES;
    }
}
