import {Injectable} from '@angular/core';
import {CompanySize} from '../../models/company-size.model';
import {RecordsBaseService} from "../records-base.service";
import {COMPANY_SIZE_ROUTE} from "../../constants/path-constants";

@Injectable({
    providedIn: 'root'
})
export class CompanySizeService extends RecordsBaseService<CompanySize, CompanySize> {

    constructor() {
        super(COMPANY_SIZE_ROUTE);
    }
}
