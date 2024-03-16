import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { debounceTime, finalize, zip } from 'rxjs';
import { CustomerBaseFormComponent } from '../customer-base-form.component';
import { NgClass, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
    BAIRRO_FORM_PATH,
    CEP_FORM_PATH,
    CNPJ_FORM_PATH,
    COMPLEMENTO_FORM_PATH,
    EMAIL_FORM_PATH,
    ENDERECO_FORM_PATH,
    FANTASIA_FORM_PATH,
    ID_FORM_PATH,
    INSCRICAO_ESTADUAL_FORM_PATH,
    MUNICIPIO_FORM_PATH,
    NUMERO_FORM_PATH,
    PHONE_NUMBER_PATH,
    PORTE_INPI_FORM_PATH,
    RAZAO_SOCIAL_FORM_PATH,
    REPRESENTATIVE_FORM_PATH,
    REPRESENTATIVE_PEOPE_FORM_PATH
} from '../../../customers-forms.constants';
import { ContactType, Customer, CustomerList } from "../../../customers.types";
import { CompanySize } from "../../../../../shared/models/company-size.model";
import { CountryService } from 'app/modules/shared/services/country/country.service';
import { StateService } from "../../../../../shared/services/state/state.service";
import { CityService } from "../../../../../shared/services/city/city.service";
import { CompanySizeService } from 'app/modules/shared/services/company-size/company-size.service';
import { ContactTypeService } from 'app/modules/shared/services/contact-type/contact-type.service';
import { CustomersService } from '../../../customers.service';
import { PF_TYPE } from "../../../customers.constants";
import { RolesService } from "../../../../roles/roles.service";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActionsFormComponent } from "../../../../../shared/components/actions-form/actions-form.component";
import { Position } from "../../../../roles/roles.types";
import {
    CompleteAddressInfoComponent
} from "../../../../../shared/components/complete-address-info/complete-address-info.component";
import { ContactsComponent } from "../../../../../shared/components/contacts/contacts.component";
import { FormHelper } from "../../../../../shared/helpers/form.helper";
import { CustomerFormProvider } from "../customer-form.provider";
import { MaskHelper } from "../../../../../shared/helpers/mask.helper";

@Component({
    selector: 'app-customer-pj-form',
    templateUrl: './customer-pj.component.html',
    styleUrls: ['./../customer.scss'],
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatTooltipModule,
        NgIf,
        NgForOf,
        NgClass,
        ActionsFormComponent,
        TitleCasePipe,
        CompleteAddressInfoComponent,
        ContactsComponent
    ],
    standalone: true
})
export class CustomerPjComponent extends CustomerBaseFormComponent implements OnInit, AfterViewInit {
    @Output() save = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Input() customer: Customer;
    @Input() editMode = false;
    @ViewChild('cnpjInput') cnpjInput: ElementRef;
    @ViewChild('inscricaoEstadual') inscricaoEstadualInput: ElementRef;
    companySizes: CompanySize[] = [];
    companySizesInitialState: CompanySize[] = [];
    positions: Position[] = [];
    customers: CustomerList[] = [];
    form = this._customerFormProvider.buildCustomerPJForm();

    constructor(protected _formBuilder: UntypedFormBuilder,
                protected _countryService: CountryService,
                protected _stateService: StateService,
                protected _cityService: CityService,
                private _positionService: RolesService,
                private _companySizeService: CompanySizeService,
                private _contactTypeService: ContactTypeService,
                private _customerFormProvider: CustomerFormProvider,
                private _customerService: CustomersService) {
        super(_stateService, _cityService, _countryService, _formBuilder);
    }

    ngAfterViewInit(): void {
        MaskHelper.addCNPJMask(this.cnpjInput);
        MaskHelper.addInsricaoEstadualMask(this.inscricaoEstadualInput);
    }

    ngOnInit(): void {
        this.loadAutoCompletes();
        this.handleCases();
        this.handleCompanyAutocompleteOnFormChange();
        this.addCompanySizeFiltering();
    }

    buildPayload(): any {
        const PJ_TYPE = 2;
        return {
            id: this.customer?.id,
            personId: this.customer?.personId,
            razaosocial: this.form.get(RAZAO_SOCIAL_FORM_PATH).value?.trim(),
            cnpj: this.form.get(CNPJ_FORM_PATH).value?.trim(),
            inscricaoestadual: this.form.get(INSCRICAO_ESTADUAL_FORM_PATH).value?.trim(),
            fantasia: this.form.get(FANTASIA_FORM_PATH).value?.trim(),
            porteinpiid: this.form.get(PORTE_INPI_FORM_PATH).value?.id,
            customerCompany: this.getValidCustomerCompany(),
            person: {
                id: this.customer?.personId,
                cidadeid: this.form.get(MUNICIPIO_FORM_PATH).value?.id,
                tipo: PJ_TYPE,
                cep: this.form.get(CEP_FORM_PATH).value?.trim(),
                bairro: this.form.get(BAIRRO_FORM_PATH).value?.trim(),
                endereco: this.form.get(ENDERECO_FORM_PATH).value?.trim(),
                complemento: this.form.get(COMPLEMENTO_FORM_PATH).value?.trim(),
                numero: this.form.get(NUMERO_FORM_PATH).value,
                contacts: this.getContacts(),
            }
        };
    }

    getValidCustomerCompany(): any[] {
        return (this.form.get(REPRESENTATIVE_FORM_PATH).getRawValue())
            .filter(contact => !!contact.person || !!contact.position && contact.position !== '')
            .map(contact => {
                return {
                    clienteid: contact?.person?.id || contact.clienteid,
                    empresaid: this.customer.id,
                    cargoid: contact?.position?.id
                }
            });
    }

    addNewEmployee(): void {
        const formGroup = this._formBuilder.group({
            person: [''],
            position: ['']
        });

        (this.form.get(REPRESENTATIVE_FORM_PATH) as UntypedFormArray).push(formGroup);
    }

    removeEmployee(index: number): void {
        (this.form.get(REPRESENTATIVE_FORM_PATH) as UntypedFormArray).removeAt(index);
    }

    private addCompanySizeFiltering(): void {
        this.form.get(PORTE_INPI_FORM_PATH)?.valueChanges.subscribe((value: string | CompanySize[]) => {
            if (value === '' || this.companySizes?.length === 0 || value === undefined) {
                this.companySizes = this.companySizesInitialState;
            }
            if (value instanceof Object) {
                return;
            }
            this.companySizes = this.companySizesInitialState?.filter(state => state?.name?.toLowerCase()?.startsWith(value?.toLowerCase()));
        });
    }

    private handleCases(): void {
        FormHelper.transformToUppercase(this.form.get(FANTASIA_FORM_PATH));
        FormHelper.transformToUppercase(this.form.get(RAZAO_SOCIAL_FORM_PATH));
        this.transformEmailsToLowercase();
    }

    private handleCompanyAutocompleteOnFormChange(): void {
        (this.form.get(REPRESENTATIVE_PEOPE_FORM_PATH) as UntypedFormArray).valueChanges
            .pipe(debounceTime(250))
            .subscribe((customerCompanies: any[]) => {
                const customerCompaniesToAutoComplete = customerCompanies
                    .filter(customerCompany => typeof customerCompany.person === 'string' && customerCompany.person.length > 0);

                if (customerCompaniesToAutoComplete.length === 0) {
                    this._customerService.getAllByType('PF').subscribe((companies) => {
                        this.customers = companies.records;
                    });
                }

                if (customerCompaniesToAutoComplete.length > 0) {
                    const firstCompany = customerCompaniesToAutoComplete[0];
                    const httpParams = new HttpParams({
                        fromObject: {
                            geral: firstCompany.person,
                            type: PF_TYPE
                        }
                    });
                    this._customerService.fetchByParams(httpParams).subscribe((filteredCompanies) => {
                        this.customers = filteredCompanies.records;
                    });
                }
            });
    }

    private loadAutoCompletes(): void {
        zip(
            this._countryService.getAll(),
            this._companySizeService.getAll(),
            this._positionService.getItemsPaged(),
            this._customerService.getAllByType('PF'),
            this._contactTypeService.getAll()
        ).pipe(finalize(() => this.loadForm()))
            .subscribe((res: any) => {
                this.companySizes = res[1] as CompanySize[];
                this.companySizesInitialState = res[1] as CompanySize[];
                this.positions = res[2].records as Position[];
                const customerList = res[3].records as CustomerList[];
                this.customers = customerList.filter(customer => !!customer.descricao);
                this.loadContacts(res[4]);
            });
    }

    private loadContacts(contactTypes: ContactType[]): void {
        const {emailsContactTypesId, phoneContactTypesId} = this.getEmailContactIds(contactTypes);
        this.emailContacts = this.customer?.person?.contacts.filter(contact => emailsContactTypesId.has(contact.contactTypeId));
        this.phoneNumbersContacts = this.customer?.person?.contacts.filter(contact => phoneContactTypesId.has(contact.contactTypeId));
    }

    private loadForm(): void {
        if (this.editMode && this.customer) {
            this.buildEditState();
        }
    }

    private buildEditState(): void {
        const porteINPI = this.getPorteINPI();
        if (porteINPI) {
            this.form.get(PORTE_INPI_FORM_PATH).setValue(porteINPI);
        }
        this.form.get(ID_FORM_PATH).setValue(this.customer?.id);
        this.form.get(FANTASIA_FORM_PATH).setValue(this.customer?.fantasia);
        this.form.get(RAZAO_SOCIAL_FORM_PATH).setValue(this.customer?.razaosocial);
        this.form.get(CNPJ_FORM_PATH).setValue(this.customer?.cnpj);
        this.form.get(INSCRICAO_ESTADUAL_FORM_PATH).setValue(this.customer?.inscricaoestadual);
        this.form.get(ENDERECO_FORM_PATH).setValue(this.customer?.person?.endereco);
        this.form.get(NUMERO_FORM_PATH).setValue(this.customer?.person?.numero);
        this.form.get(BAIRRO_FORM_PATH).setValue(this.customer?.person?.bairro);
        this.form.get(COMPLEMENTO_FORM_PATH).setValue(this.customer?.person?.complemento);
        this.form.get(CEP_FORM_PATH).setValue(this.customer?.person?.cep);
        this.setAutocompletes();
    }

    private getPorteINPI(): CompanySize {
        const {porteinpiid} = this.customer;
        return this.companySizes.filter(companySize => companySize.id === porteinpiid)[0];
    }

    private setAutocompletes(): void {
        this.clearListForms();
        this.loadContactsInForm(this.emailContacts, EMAIL_FORM_PATH);
        this.loadContactsInForm(this.phoneNumbersContacts, PHONE_NUMBER_PATH);
        this.customer?.customerCompany?.map((customerCompany) => {
            const person = {
                ...customerCompany.customer,
                descricao: customerCompany.customer.nome,
            };
            return this._formBuilder.group({
                person: [person, [Validators.required]],
                position: [customerCompany.position, [Validators.required]]
            });
        }).forEach(formGroup => (this.form.get(REPRESENTATIVE_FORM_PATH) as UntypedFormArray).push(formGroup));
    }
}
