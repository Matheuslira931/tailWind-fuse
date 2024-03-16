import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaritalStatus } from 'app/modules/shared/models/marital-status.model';
import { ContactTypeService } from "../../../../../shared/services/contact-type/contact-type.service";
import { CountryService } from "../../../../../shared/services/country/country.service";
import { StateService } from "../../../../../shared/services/state/state.service";
import { filterLegalResponsiblePosition } from "../../../customers.constants";
import { Customer, CustomerCompany, CustomerType } from "../../../customers.types";
import { CityService } from "../../../../../shared/services/city/city.service";
import { CustomersService } from "../../../customers.service";
import { DatePipe, NgForOf, NgIf, TitleCasePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TelefonePipe } from "../../../../../shared/pipes/telefone.pipe";
import { CpfPipe } from "../../../../../shared/pipes/cpf.pipe";
import { ViewBaseComponent } from "../view.base";
import { MaritalStatusService } from "../../../../../shared/services/marital-status/marital-status.service";
import { StringHelper } from "../../../../../shared/helpers/string.helper";
import { CepMaskPipe } from "../../../../../shared/pipes/cep-mask.pipe";

@Component({
    selector: 'app-customer-pf-view',
    templateUrl: './customer-pf-view.component.html',
    imports: [
        TitleCasePipe,
        MatIconModule,
        NgIf,
        TelefonePipe,
        DatePipe,
        NgForOf,
        CpfPipe
    ],
    providers: [CepMaskPipe],
    standalone: true
})
export class CustomerPfViewComponent extends ViewBaseComponent implements OnInit {
    @Input() customer: Customer;
    maritalStatus?: MaritalStatus;
    companiesUnderResponsibility?: CustomerCompany[] = [];

    constructor(public _router: Router,
                private _maritalStatusService: MaritalStatusService,
                public _customerService: CustomersService,
                public _contactTypeService: ContactTypeService,
                public _cityService: CityService,
                public _countryService: CountryService,
                public _stateService: StateService,
                public _activatedRoute: ActivatedRoute,
                public _cepMaskPipe: CepMaskPipe) {
        super(_router, _cityService, _stateService, _countryService, _contactTypeService, _activatedRoute, _customerService, _cepMaskPipe);
    }

    ngOnInit(): void {
        this.afterLoadCustomer();
        this.loadCustomer();
        this.loadContactTypes();
        this.loadMaritalStatus();
        this.loadStateAndCity();
    }

    getCompanyName(customerCompany: CustomerCompany): string {
        const hasFantasyName = StringHelper.shouldShowString(customerCompany.company?.fantasia ?? '');
        if (hasFantasyName) {
            return customerCompany.company?.fantasia;
        }
        return customerCompany.company?.razaosocial;
    }

    private loadMaritalStatus(): void {
        this._maritalStatusService.getAll()
            .subscribe((maritalStatusList) => {
                this.maritalStatus = maritalStatusList
                    .filter(maritalStatus => maritalStatus?.id === this.customer?.estadocivilid)[0];
            });
    }

    /**
     * The timeout below is used to delay the angular update the dom tree and wait until it to have its value
     * updated properly
     */
    afterLoadCustomer(): void {
        if (!this.customer) {
            return;
        }
        setTimeout(() => {
            this.companiesUnderResponsibility = this.customer.customerCompany?.filter(filterLegalResponsiblePosition) ?? [];
        }, 500);
    }

    protected readonly CustomerType = CustomerType;
}
