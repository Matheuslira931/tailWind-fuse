import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact, Customer, CustomerType } from "../../../customers.types";
import { CompanySize } from "../../../../../shared/models/company-size.model";
import { CompanySizeService } from "../../../../../shared/services/company-size/company-size.service";
import { CityService } from "../../../../../shared/services/city/city.service";
import { CountryService } from "../../../../../shared/services/country/country.service";
import { StateService } from "../../../../../shared/services/state/state.service";
import { ContactTypeService } from "../../../../../shared/services/contact-type/contact-type.service";
import { CustomersService } from "../../../customers.service";
import { MatIconModule } from "@angular/material/icon";
import { NgForOf, NgIf, TitleCasePipe } from "@angular/common";
import { CnpjPipe } from "../../../../../shared/pipes/cnpj.pipe";
import { TelefonePipe } from "../../../../../shared/pipes/telefone.pipe";
import {
    EMAIL_TYPE_CONTACT_GROUP,
    ID_COMPANY_RESPONSIBLE,
    PHONE_TYPE_CONTACT_GROUP
} from "../../../customers.constants";
import { ViewBaseComponent } from "../view.base";
import { StringHelper } from "../../../../../shared/helpers/string.helper";
import { CepMaskPipe } from "../../../../../shared/pipes/cep-mask.pipe";

@Component({
    selector: 'app-customer-pj-view',
    templateUrl: './customer-pj-view.component.html',
    imports: [
        MatIconModule,
        NgIf,
        NgForOf,
        TitleCasePipe,
        CnpjPipe,
        TelefonePipe
    ],
    providers: [CepMaskPipe],
    standalone: true
})
export class CustomerPjViewComponent extends ViewBaseComponent implements OnInit {
    @Input() customer: Customer;
    companySizes: CompanySize[];
    companySize: CompanySize;
    responsibles: Customer[];

    constructor(public _customerService: CustomersService,
                private _companySizeService: CompanySizeService,
                public _router: Router,
                public _cityService: CityService,
                public _countryService: CountryService,
                public _stateService: StateService,
                public _contactTypeService: ContactTypeService,
                public _cepMaskPipe: CepMaskPipe,
                public _activatedRoute: ActivatedRoute) {
        super(_router, _cityService, _stateService, _countryService, _contactTypeService, _activatedRoute, _customerService, _cepMaskPipe);
    }

    ngOnInit(): void {
        this.responsibles = this.customer?.customerCompany
            .filter(customerCompany => customerCompany.cargoid === ID_COMPANY_RESPONSIBLE)
            .map(customerCompany => customerCompany.customer);
        this.loadContactTypes();
        this.loadCompanySize();
        this.phoneNumbers = this.customer?.person?.contacts?.filter((contact: Contact) => contact.contactTypeId === PHONE_TYPE_CONTACT_GROUP) ?? [];
        this.emails = this.customer?.person?.contacts.filter((contact: Contact) => contact.contactTypeId === EMAIL_TYPE_CONTACT_GROUP) ?? [];
        this.loadCustomer();
        this.loadStateAndCity();
    }

    afterLoadCustomer(): void {
        setTimeout(() => {
            this.responsibles = this.customer?.customerCompany
                .filter(customerCompany => customerCompany.cargoid === ID_COMPANY_RESPONSIBLE)
                .map(customerCompany => customerCompany.customer);
        }, 1000);
        this.loadCompanySize();
    }

    private loadCompanySize(): void {
        this._companySizeService.getAll().subscribe((sizes) => {
            this.companySizes = sizes;
            const companySizeFiltered = this.companySizes?.filter(companySize => this.customer?.porteinpiid === companySize?.id);
            if (companySizeFiltered?.length > 0) {
                this.companySize = companySizeFiltered[0];
            }
        });
    }

    getCompanyName(customer: Customer): string {
        const hasFantasyName = StringHelper.shouldShowString(customer?.fantasia ?? '');
        if (hasFantasyName) {
            return customer?.fantasia;
        }
        return customer?.razaosocial;
    }

    protected readonly CustomerType = CustomerType;
}
