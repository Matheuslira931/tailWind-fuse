import {FormBuilder, FormGroup, UntypedFormArray, Validators} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {EventEmitter} from '@angular/core';
import {StateService} from 'app/modules/shared/services/state/state.service';
import {CityService} from "../../../../shared/services/city/city.service";
import {CountryService} from "../../../../shared/services/country/country.service";
import {MaritalStatus} from "../../../../shared/models/marital-status.model";
import {CompanySize} from "../../../../shared/models/company-size.model";
import {Contact, ContactData, ContactPair, ContactType, Customer, CustomerList} from "../../customers.types";
import {Position} from "../../../roles/roles.types";
import {EMAIL_FORM_PATH, PHONE_NUMBER_PATH, REPRESENTATIVE_FORM_PATH} from "../../customers-forms.constants";

export abstract class CustomerBaseFormComponent {
    save = new EventEmitter();
    delete = new EventEmitter();
    cancel = new EventEmitter();

    contactTypeById: Map<number, ContactType> = new Map();
    customer: Customer;
    editMode = false;
    form: FormGroup;
    positions: Position[] = [];
    emailContacts!: Contact[];
    phoneNumbersContacts!: Contact[];

    constructor(protected _stateService: StateService,
                protected _cityService: CityService,
                protected _countryService: CountryService,
                protected _formBuilder: FormBuilder) {
    }

    getCompanyName(customer: any): string {
        return customer?.descricao || customer?.fantasia;
    }

    getPositionName(position: Position): string {
        return position?.nome;
    }

    getMaritalStatusName(maritalStatus: MaritalStatus): string {
        return maritalStatus?.name;
    }

    getCustomerName(customer: CustomerList): string {
        return customer?.descricao;
    }

    getCompanySize(companySize: CompanySize): string {
        return companySize?.name;
    }

    getContacts() {
        return [
            ...this.getContactsByPath(PHONE_NUMBER_PATH),
            ...this.getContactsByPath(EMAIL_FORM_PATH),
        ].map(contact => {
            const parsedContact: Partial<Contact> = {
                description: contact.value?.trim(),
                contactTypeId: contact.type.id,
                personId: this.customer?.personId
            };
            return parsedContact;
        });
    }

    getContactsByPath(path: string): ContactPair[] {
        return (this.form.get(path).getRawValue() as ContactPair[])
            .filter(contact => !!contact.value || !!contact.type);
    }

    transformEmailsToLowercase(): void {
        this.form.get(EMAIL_FORM_PATH)?.valueChanges?.pipe(debounceTime(250))
            .subscribe((emailPair: ContactPair[]) => {
                for (let i = 0; i < emailPair.length; i++) {
                    const formControl = (this.form.get(EMAIL_FORM_PATH) as UntypedFormArray).at(i);
                    const contactPair: ContactPair = formControl.value;
                    if (!contactPair.value) {
                        continue;
                    }
                    formControl.get('value').setValue(contactPair.value.toLowerCase());
                }
            });
    }

    loadContactsInForm(contacts: Contact[], path: string): void {
        contacts.map(contact => this._formBuilder.group({
            value: [contact.description, [Validators.required]],
            type: [this.contactTypeById.get(contact.contactTypeId), [Validators.required]]
        })).forEach(formGroup => (this.form.get(path) as UntypedFormArray).push(formGroup));
    }

    getEmailContactIds(contactTypes: ContactType[]): ContactData {
        contactTypes.forEach(contactType => this.contactTypeById.set(contactType.id, contactType));
        const emailsContactTypesId = new Set<number>();
        const phoneContactTypesId = new Set<number>();
        this.contactTypeById.forEach((contactType) => {
            if (contactType.contactGroup === 1) {
                emailsContactTypesId.add(contactType.id);
            } else if (contactType.contactGroup === 2) {
                phoneContactTypesId.add(contactType.id);
            }
        });
        return {emailsContactTypesId, phoneContactTypesId};
    }

    clearListForms(): void {
        if (this.emailContacts?.length > 0) {
            (this.form.get(EMAIL_FORM_PATH) as UntypedFormArray).clear();
        }
        if (this.phoneNumbersContacts?.length > 0) {
            (this.form.get(PHONE_NUMBER_PATH) as UntypedFormArray).clear();
        }
        if (this.customer?.customerCompany?.length > 0) {
            (this.form.get(REPRESENTATIVE_FORM_PATH) as UntypedFormArray).clear();
        }
    }
}
