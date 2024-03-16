import {Injectable} from '@angular/core';
import {ContactType} from "../../models/contact-type.model";
import {RecordsBaseService} from "../records-base.service";
import {CONTACT_TYPE_ROUTE} from "../../constants/path-constants";

@Injectable({
    providedIn: 'root'
})
export class ContactTypeService extends RecordsBaseService<ContactType, ContactType> {
    constructor() {
        super(CONTACT_TYPE_ROUTE);
    }
}
