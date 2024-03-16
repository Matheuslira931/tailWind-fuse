import {
    AsyncPipe,
    I18nPluralPipe,
    LowerCasePipe,
    NgClass,
    NgFor,
    NgIf,
    TitleCasePipe,
    UpperCasePipe
} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CustomersService } from "../customers.service";
import { Customer, CustomerFilterType, CustomerList, CustomerType, PersonList } from "../customers.types";
import { BaseListComponent } from "../../../shared/components/base/base-list.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CnpjCpfPipe } from "../../../shared/pipes/cnpj.cpf.pipe";
import { TelefonePipe } from "../../../shared/pipes/telefone.pipe";
import { MatSortModule, Sort } from "@angular/material/sort";
import { TruncatePipe } from "../../../shared/pipes/truncate.pipe";
import { HttpParams } from "@angular/common/http";
import { HeaderListComponent } from "../../../shared/components/header-list/header-list.component";
import { Page } from "../../../shared/models/page.model";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PeopleService } from "../people.service";

@Component({
    selector: 'customers-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, MatMenuModule, MatPaginatorModule, TitleCasePipe, CnpjCpfPipe, TelefonePipe, MatSortModule, LowerCasePipe, UpperCasePipe, TruncatePipe, HeaderListComponent, MatTooltipModule],
    providers: [TitleCasePipe]
})
export class CustomersListComponent extends BaseListComponent<CustomerList, Customer> {

    listTitle: string = 'Clientes';
    customerType = CustomerType;
    customerTypeFilter = CustomerFilterType;
    sort!: Sort;
    records!: Page<PersonList>;

    constructor(
        public _service: CustomersService,
        public _peopleService: PeopleService,
    ) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
        this.reloadList();
        console.log('this.records');
        console.log(this.records);
        this._peopleService.getItemsPaged().subscribe(value => {
            console.log('value');
            console.log(value);
            this.records = value;
        });
    }

    search(query: string) {
        this._service.search(query).subscribe(records => {
            this.records = records;
        })
    }

    reloadList(): void {
        this.records$.subscribe(page => {
            this.records = page;
        });
    }

    addNewCustomer(customerType: CustomerType): void {
        this._router.navigate(['./new'], {
            relativeTo: this._activatedRoute,
            queryParams: {'customerType': customerType}
        });
    }

    filterBy(customerFilter: CustomerFilterType): void {
        if (customerFilter === CustomerFilterType.ALL) {
            this.records$ = this._service.getItemsPaged(this.pageIndex + 1, this.pageSize);
            return;
        }
        const httpParams = new HttpParams({
            fromObject: {
                PageNumber: this.pageIndex + 1,
                PageSize: this.pageSize,
                type: customerFilter === CustomerFilterType.PF ? 1 : 2
            }
        });
        this._service.fetchByParams(httpParams).subscribe(page => {
            this.records = page;
        });
    }

    sortData(sortEvent: Sort): void {
        this.sort = sortEvent;
        const httpParams = new HttpParams({
            fromObject: {
                PageNumber: this.pageIndex + 1,
                PageSize: this.pageSize,
                OrderBy: `${sortEvent.active} ${sortEvent.direction}`
            }
        });
        this._service.fetchByParams(httpParams).subscribe(page => {
            this.records = page;
        });
    }
}
