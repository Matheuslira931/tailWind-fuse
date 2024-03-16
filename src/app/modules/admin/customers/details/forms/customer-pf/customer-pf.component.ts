import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { FormArray, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { debounceTime, finalize, zip } from 'rxjs';
import { CustomerBaseFormComponent } from '../customer-base-form.component';
import { DatePipe, NgClass, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
    BAIRRO_FORM_PATH,
    CEP_FORM_PATH,
    COMPANIES_FORM_PATH,
    COMPANY_FORM_PATH,
    COMPLEMENTO_FORM_PATH,
    DATA_NASCIMENTO_FORM_PATH,
    EMAIL_FORM_PATH,
    ENDERECO_FORM_PATH,
    ESTADO_CIVIL_FORM_PATH,
    ID_FORM_PATH,
    MUNICIPIO_FORM_PATH,
    NACIONALIDADE_FORM_PATH,
    NOME_FORM_PATH,
    NUMERO_FORM_PATH,
    PERSONAL_DOCUMENTS_FORM_PATH,
    PHONE_NUMBER_FORM_PATH,
    PROFISSAO_FORM_PATH
} from "../../../customers-forms.constants";
import { MaritalStatus } from "../../../../../shared/models/marital-status.model";
import { Contact, ContactType, Customer, CustomerCompanyPair } from "../../../customers.types";
import { CountryService } from "../../../../../shared/services/country/country.service";
import { StateService } from "../../../../../shared/services/state/state.service";
import { CityService } from "../../../../../shared/services/city/city.service";
import { ContactTypeService } from "../../../../../shared/services/contact-type/contact-type.service";
import { CustomersService } from '../../../customers.service';
import { RolesService } from "../../../../roles/roles.service";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ActionsFormComponent } from "../../../../../shared/components/actions-form/actions-form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
    CompleteAddressInfoComponent
} from "../../../../../shared/components/complete-address-info/complete-address-info.component";
import { ContactsComponent } from "../../../../../shared/components/contacts/contacts.component";
import { MaritalStatusService } from "../../../../../shared/services/marital-status/marital-status.service";
import { FormHelper } from "../../../../../shared/helpers/form.helper";
import { CustomerFormProvider } from "../customer-form.provider";
import { MaskHelper } from "../../../../../shared/helpers/mask.helper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DateAdapter, MatNativeDateModule } from "@angular/material/core";
import moment from "moment";
import { DateProvider } from "../../../../../shared/providers/date.provider";

const PJ_TYPE = 2;

@Component({
    selector: 'app-customer-pf-form',
    templateUrl: './customer-pf.component.html',
    styleUrls: ['./../customer.scss'],
    imports: [
        MatInputModule,
        MatIconModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        TitleCasePipe,
        ActionsFormComponent,
        NgClass,
        MatButtonModule,
        MatTooltipModule,
        CompleteAddressInfoComponent,
        ContactsComponent,
        MatFormFieldModule,
        MatNativeDateModule,
    ],
    providers: [DatePipe, DateProvider],
    standalone: true
})
export class CustomerPfComponent extends CustomerBaseFormComponent implements OnInit, AfterViewInit {
    @Output() save = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Input() customer: Customer;
    @Input() editMode = false;
    @ViewChildren('input') inputRefList: ElementRef[];
    @ViewChild('cpfInput') cpfInput: ElementRef;
    @ViewChild('dataNascimento') birthdayInput: ElementRef;
    companies: any[] = [];
    maritalStatusList: MaritalStatus[] = [];
    emailContacts!: Contact[];
    phoneNumbersContacts!: Contact[];
    form = this._customerFormProvider.buildCustomerPFForm();

    constructor(protected _formBuilder: UntypedFormBuilder,
                protected _countryService: CountryService,
                protected _stateService: StateService,
                protected _cityService: CityService,
                protected _titleCasePipe: TitleCasePipe,
                private _maritalStatusService: MaritalStatusService,
                private _positionService: RolesService,
                private _contactTypeService: ContactTypeService,
                private _customerFormProvider: CustomerFormProvider,
                private dateAdapter: DateAdapter<any>,
                private _customerService: CustomersService) {
        super(_stateService, _cityService, _countryService, _formBuilder);
    }

    ngAfterViewInit(): void {
        MaskHelper.addCPFMask(this.cpfInput);
        MaskHelper.addDateMask(this.birthdayInput);
    }

    ngOnInit(): void {
        moment.locale('pt-BR');
        this.dateAdapter.setLocale('pt-br');
        this.loadLists();
        // this.addFilters();
        this.handleInputsCases();
        this.handleCompanyAutocompleteOnFormChange();
    }

    buildPayload(): any {
        const PF_TYPE = 1;
        const validCompanies = this.getValidCompanies();
        return {
            id: this.customer?.id,
            personId: this.customer?.personId,
            nome: this.form.get(NOME_FORM_PATH).value?.trim(),
            cpf: (this.form.get(PERSONAL_DOCUMENTS_FORM_PATH) as FormArray).at(0)?.value?.value?.toString()?.trim(),
            rg: (this.form.get(PERSONAL_DOCUMENTS_FORM_PATH) as FormArray).at(1)?.value?.value?.toString()?.trim(),
            documentoProfissional: (this.form.get(PERSONAL_DOCUMENTS_FORM_PATH) as FormArray).at(2)?.value.value?.toString()?.trim(),
            profissao: this.form.get(PROFISSAO_FORM_PATH).value?.trim(),
            estadoCivilid: this.form.get(ESTADO_CIVIL_FORM_PATH).value?.id,
            datanascimento: this.form.get(DATA_NASCIMENTO_FORM_PATH).value !== '' ? this.form.get(DATA_NASCIMENTO_FORM_PATH).value : null,
            nacionalidade: this.form.get(NACIONALIDADE_FORM_PATH).value?.trim(),
            customerCompany: validCompanies,
            person: {
                id: this.customer?.personId,
                cidadeid: this.form.get(MUNICIPIO_FORM_PATH).value?.id,
                tipo: PF_TYPE,
                endereco: this.form.get(ENDERECO_FORM_PATH).value?.trim(),
                cep: this.form.get(CEP_FORM_PATH).value.toString()?.trim(),
                bairro: this.form.get(BAIRRO_FORM_PATH).value?.trim(),
                complemento: this.form.get(COMPLEMENTO_FORM_PATH).value?.trim(),
                numero: this.form.get(NUMERO_FORM_PATH).value.toString(),
                contacts: this.getContacts(),
            }
        };
    }

    removeCompany(index: number): void {
        (this.form.get(COMPANY_FORM_PATH) as UntypedFormArray).removeAt(index);
    }

    addNewCompany(): void {
        const formGroup = this._formBuilder.group({
            empresa: [''],
            cargo: ['']
        });

        (this.form.get(COMPANY_FORM_PATH) as UntypedFormArray).push(formGroup);
    }

    getValidCompanies(): any[] {
        return (this.form.get(COMPANY_FORM_PATH).getRawValue() as CustomerCompanyPair[])
            .filter(contact => !!contact.empresa || !!contact.cargo)
            .map(contact => ({
                empresaid: contact.empresa.id,
                cargoid: contact.cargo.id,
                clienteid: this.customer?.id
            }));
    }

    positionAutoComplete(event: Event): void {
        this.inputRefList.forEach((inputRef) => {
            const value: string | object = inputRef.nativeElement.value;
            if (value === '' || this.positions?.length === 0) {
                // this.positons = this.statesInitialState;
            }
            if (value instanceof Object) {
                return;
            }
            // this.positons = this.positionsInitialState.filter(state => state.nome.toLowerCase().startsWith(value.toLowerCase()));
        });
    }

    private handleCompanyAutocompleteOnFormChange(): void {
        (this.form.get(COMPANIES_FORM_PATH) as UntypedFormArray).valueChanges
            .pipe(debounceTime(250))
            .subscribe((customerCompanies: any[]) => {
                const customerCompaniesToAutoComplete = customerCompanies
                    .filter(customerCompany => typeof customerCompany.empresa === 'string' && customerCompany.empresa.length > 0);

                if (customerCompaniesToAutoComplete.length === 0) {
                    this._customerService.getAllByType('PJ').subscribe((companies) => {
                        this.companies = companies.records;
                    });
                }

                if (customerCompaniesToAutoComplete.length > 0) {
                    const firstCompany = customerCompaniesToAutoComplete[0];
                    const httpParams = new HttpParams({
                        fromObject: {
                            geral: firstCompany.empresa,
                            type: PJ_TYPE
                        }
                    });
                    this._customerService.fetchByParams(httpParams).subscribe((filteredCompanies) => {
                        this.companies = filteredCompanies.records;
                    });
                }
            });
    }

    private handleInputsCases(): void {
        FormHelper.transformToUppercase(this.form.get(PROFISSAO_FORM_PATH));
        FormHelper.transformToUppercase(this.form.get(NACIONALIDADE_FORM_PATH));
        this.transformEmailsToLowercase();
    }

    private setAutoCompletes(): void {
        this.loadCompanyOnAutocomplete();
        this.setAutocompleteOnMaritalStatus();
        this.setPersonalDocuments();
        this.setAutocomplete();
    }

    private setAutocomplete(): void {
        this.clearListForms();
        this.loadContactsInForm(this.emailContacts, EMAIL_FORM_PATH);
        this.loadContactsInForm(this.phoneNumbersContacts, PHONE_NUMBER_FORM_PATH);
        this.customer?.customerCompany?.map(customerCompany => this._formBuilder.group({
            empresa: [{
                ...customerCompany.company,
                descricao: customerCompany.customer.nome
            }, [Validators.required]],
            cargo: [customerCompany.position, [Validators.required]]
        })).forEach(formGroup => (this.form.get(COMPANY_FORM_PATH) as UntypedFormArray).push(formGroup));
    }

    private setPersonalDocuments(): void {
        const map = new Map<number, string>([
            [0, this.customer?.cpf],
            [1, this.customer?.rg],
            [2, this.customer?.documentoprofissional],
        ]);

        map.forEach((value, key) =>
            (this.form.get(PERSONAL_DOCUMENTS_FORM_PATH) as FormArray)?.at(key).get('value').setValue(value)
        );
    }

    private loadCompanyOnAutocomplete(): void {
        (this.form.get(COMPANY_FORM_PATH) as UntypedFormArray).clear();
        this.customer?.customerCompany?.forEach((customerCompany) => {
            const formGroup = this._formBuilder.group({
                empresa: [{
                    ...customerCompany.company,
                    descricao: customerCompany.company.razaosocial
                }],
                cargo: [customerCompany.position]
            });
            (this.form.get(COMPANY_FORM_PATH) as UntypedFormArray).push(formGroup);
        });
    }

    private loadLists(): void {
        zip(
            this._customerService.getAllByType('PJ'),
            this._countryService.getAll(),
            this._maritalStatusService.getAll(),
            this._positionService.getItemsPaged(),
            this._contactTypeService.getAll()
        )
            .pipe(finalize(() => {
                if (this.editMode && this.customer) {
                    this.buildEditState();
                }
            }))
            .subscribe((res: any) => {
                this.companies = res[0].records.map((company) => {
                    company.descricao = this._titleCasePipe.transform(company.descricao);
                    return company;
                });
                this.maritalStatusList = res[2];
                this.positions = res[3].records;
                this.loadContacts(res[4]);
            });
    }

    private loadContacts(contactTypes: ContactType[]): void {
        const {emailsContactTypesId, phoneContactTypesId} = this.getEmailContactIds(contactTypes);
        this.emailContacts = this.customer?.person?.contacts.filter(contact => emailsContactTypesId.has(contact.contactTypeId));
        this.phoneNumbersContacts = this.customer?.person?.contacts.filter(contact => phoneContactTypesId.has(contact.contactTypeId));
    }

    private buildEditState(): void {
        this.form.get(ID_FORM_PATH).setValue(this.customer?.id);
        this.form.get(NOME_FORM_PATH).setValue(this.customer?.nome);
        this.form.get(PROFISSAO_FORM_PATH).setValue(this.customer?.profissao);
        this.form.get(ESTADO_CIVIL_FORM_PATH).setValue(undefined);
        this.form.get(ENDERECO_FORM_PATH).setValue(this.customer?.person?.endereco);
        this.form.get(BAIRRO_FORM_PATH).setValue(this.customer?.person?.bairro);
        this.form.get(COMPLEMENTO_FORM_PATH).setValue(this.customer?.person?.complemento);
        this.form.get(CEP_FORM_PATH).setValue(this.customer?.person?.cep);
        this.form.get(NUMERO_FORM_PATH).setValue(this.customer?.person?.numero);
        this.form.get(NACIONALIDADE_FORM_PATH).setValue(this.customer?.nacionalidade);
        this.form.get(DATA_NASCIMENTO_FORM_PATH).setValue(this.customer?.datanascimento);
        this.setAutoCompletes();
    }

    private setAutocompleteOnMaritalStatus(): void {
        const maritalStatusList = this.maritalStatusList
            .filter(maritalStatus => maritalStatus.id === this.customer.estadocivilid);
        if (maritalStatusList && maritalStatusList.length > 0) {
            this.form.get(ESTADO_CIVIL_FORM_PATH).setValue(maritalStatusList[0]);
        }
    }
}
