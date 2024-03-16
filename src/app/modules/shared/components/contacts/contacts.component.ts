import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup} from "@angular/forms";
import {EMAIL_FORM_PATH, PHONE_NUMBER_PATH} from "../../../admin/customers/customers-forms.constants";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ContactType} from "../../../admin/customers/customers.types";
import {ContactTypeService} from "../../services/contact-type/contact-type.service";
import {EMAIL_CONTACT_GROUP, PHONE_NUMBER_CONTACT_GROUP} from "../../../admin/customers/customers.constants";
import {MaskHelper} from "../../helpers/mask.helper";

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    imports: [
        MatIconModule,
        NgForOf,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatTooltipModule,
        NgIf
    ],
    standalone: true
})
export class ContactsComponent implements OnInit, AfterViewChecked {
    @Input() form: UntypedFormGroup;
    @ViewChildren('phoneNumbers') phoneNumbers: ElementRef[];
    emailTypes: ContactType[] = [];
    phoneTypes: ContactType[] = [];
    PHONE_NUMBER_PATH = PHONE_NUMBER_PATH;
    EMAIL_FORM_PATH = EMAIL_FORM_PATH;

    private contactTypes!: ContactType[];

    constructor(private _formBuilder: FormBuilder,
                private _service: ContactTypeService) {
    }

    ngAfterViewChecked(): void {
        this.phoneNumbers.forEach(elementRef => MaskHelper.addPhoneNumberMask(elementRef));
    }

    ngOnInit(): void {
        this._service.getAll().subscribe(contactTypes => {
            this.contactTypes = contactTypes;
            this.emailTypes = this.filterByContactType(EMAIL_CONTACT_GROUP);
            this.phoneTypes = this.filterByContactType(PHONE_NUMBER_CONTACT_GROUP);
        })
    }

    private filterByContactType(group: number): ContactType[] {
        return this.contactTypes.filter(contactType => contactType.contactGroup === group);
    }

    addNew(path: string): void {
        const formGroup = this.buildFormGroup();

        (this.form.get(path) as UntypedFormArray).push(formGroup);
    }

    remove(index: number, path: string): void {
        (this.form.get(path) as UntypedFormArray).removeAt(index);
    }

    getContactName(contactType: ContactType): string {
        return contactType?.description;
    }

    private buildFormGroup(): FormGroup {
        return this._formBuilder.group({
            value: [''],
            type: ['']
        });
    }
}
