import { Directive } from '@angular/core';
import { Contact, ContactType, Customer, CustomerType } from "../../customers.types";
import { ActivatedRoute, Router } from "@angular/router";
import { State } from "../../../../shared/models/state.model";
import { City } from "../../../../shared/models/city.model";
import { Country } from "../../../../shared/models/country.model";
import { map, switchMap, tap } from "rxjs";
import { CityService } from "../../../../shared/services/city/city.service";
import { StateService } from "../../../../shared/services/state/state.service";
import { CountryService } from "../../../../shared/services/country/country.service";
import { ContactTypeService } from "../../../../shared/services/contact-type/contact-type.service";
import { EMAIL_TYPE_CONTACT_GROUP, PHONE_TYPE_CONTACT_GROUP } from "../../customers.constants";
import { CustomersService } from "../../customers.service";
import { CepMaskPipe } from "../../../../shared/pipes/cep-mask.pipe";

@Directive()
export abstract class ViewBaseComponent {
    customer: Customer;
    state?: State;
    city?: City;
    country?: Country;
    emails?: Contact[];
    phoneNumbers?: Contact[];
    _router: Router
    _cityService: CityService;
    _stateService: StateService;
    _countryService: CountryService;
    _contactTypeService: ContactTypeService;
    _activatedRoute: ActivatedRoute;
    _customerService: CustomersService;
    _cepMaskPipe: CepMaskPipe;
    contactTypeById: Map<number, ContactType> = new Map();
    contactTypesIdsForPhones: Map<number, ContactType> = new Map();
    contactTypesIdsForEmailGroup: Map<number, ContactType> = new Map();

    constructor(router: Router,
                cityService: CityService,
                stateService: StateService,
                countryService: CountryService,
                contactTypeService: ContactTypeService,
                activatedRoute: ActivatedRoute,
                customerService: CustomersService,
                cepMaskPipe: CepMaskPipe) {
        this._router = router;
        this._cityService = cityService;
        this._stateService = stateService;
        this._countryService = countryService;
        this._contactTypeService = contactTypeService;
        this._activatedRoute = activatedRoute;
        this._customerService = customerService;
        this._cepMaskPipe = cepMaskPipe;
    }

    onClickResponsible(company: any, customerType: CustomerType): void {
        const id = customerType === CustomerType.PF ? company.personId : company.company.personId;
        this._router.navigate([`./clientes/${id}`], {
            queryParams: {customerType: customerType}
        });
    }

    loadStateAndCity(): void {
        if (this.customer?.person?.cidadeid) {
            this._cityService.getById(this.customer?.person?.cidadeid)
                .pipe(switchMap((city) => {
                        this.city = city;
                        return this._stateService.getById(city?.estadoid);
                    }),
                    switchMap((state) => {
                        this.state = state;
                        return this._countryService.getByStateId(state.id);
                    }),
                    tap(country => this.country = country)
                )
                .subscribe();
        }
    }

    loadContactTypes(): void {
        this._contactTypeService.getAll().subscribe((contactTypes) => {
            contactTypes.forEach((contactType) => {
                this.contactTypeById.set(contactType.id, contactType);
                if (contactType.contactGroup === 1) {
                    this.contactTypesIdsForEmailGroup.set(contactType.id, contactType);
                } else if (contactType.contactGroup === 2) {
                    this.contactTypesIdsForPhones.set(contactType.id, contactType);
                }
            });
            const emailsContactTypesId = new Set<number>();
            const phoneContactTypesId = new Set<number>();
            this.contactTypeById.forEach((contactType) => {
                const isEmail = contactType.contactGroup === 1;
                const isTelephone = contactType.contactGroup === 2;
                if (isEmail) {
                    emailsContactTypesId.add(contactType.id);
                } else if (isTelephone) {
                    phoneContactTypesId.add(contactType.id);
                }
            });
            this.emails = this.customer?.person?.contacts.filter(contact => emailsContactTypesId.has(contact.contactTypeId));
            this.phoneNumbers = this.customer?.person?.contacts.filter(contact => phoneContactTypesId.has(contact.contactTypeId));
        });
    }

    shouldShow(value: string | undefined): boolean {
        return !(!value || value === '' || value === '""' || value === ' ');
    }

    loadCustomer(): void {
        if (this.customer) {
            return;
        }

        this._activatedRoute.params
            .pipe(
                map((params: { id: number }) => params.id),
                switchMap(customerId => this._customerService.getById(customerId)))
            .subscribe((customer: Customer) => {
                this.customer = customer;
                this.phoneNumbers = this.filterContactByContactGroup(PHONE_TYPE_CONTACT_GROUP);
                this.emails = this.filterContactByContactGroup(EMAIL_TYPE_CONTACT_GROUP);
                this.loadStateAndCity();
                this.afterLoadCustomer();
            });
    }

    hasAddressDetailsToShow(): boolean {
        return this.shouldShow(this.customer?.person?.complemento)
            || this.shouldShow(this.customer?.person?.cep)
            || this.shouldShow(this.customer?.person?.cep);
    }

    buildAddressDetails(): string {
        const stringsToShow = [];
        this.addValueIfPresent(this.customer?.person?.complemento, stringsToShow);
        this.addValueIfPresent(this.customer?.person?.bairro, stringsToShow);
        if (this.customer?.person?.cep) {
            const cep = this._cepMaskPipe.transform(this.customer?.person?.cep);
            this.addValueIfPresent(` CEP ${cep}`, stringsToShow);
        }
        return stringsToShow.join(',');
    }

    abstract afterLoadCustomer();

    private filterContactByContactGroup(contactGroup: number): Contact[] {
        return this.customer?.person?.contacts?.filter((contact: Contact) => contact.contactTypeId === contactGroup) ?? [];
    }

    private addValueIfPresent(value: string, stringsToShow: any[]): void {
        if (!this.shouldShow(value)) {
            return;
        }
        stringsToShow.push(value);
    }
}
