import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, CurrencyPipe, DatePipe, JsonPipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ServiceOrdersService } from "../service-orders.service";
import { ServiceOrderListComponent } from "../list/list.component";
import { AlertService } from "../../../shared/components/alert/alert.service";
import { DetailsHeaderComponent } from "../../../shared/components/details-header/details-header.component";
import { BaseDetailsComponent } from "../../../shared/components/base/base-details.component";
import { LoaderService } from "../../../shared/services/loader.service";
import { ServiceOrderList } from "../service-orders.types";
import { MatMenuModule } from "@angular/material/menu";
import { CardOptionsComponent } from "../../../shared/components/card-options/card-options.component";
import { CardOptions } from "../../../shared/components/card-options/card-options.types";
import { MatDialog } from "@angular/material/dialog";
import { ViewInputSwap } from "../../../shared/components/view-input-swap/view-input-swap.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FileManagerListComponent } from "../../../shared/components/attachments/list/list.component";
import { AvailabilityPipe } from "../../../shared/pipes/availability.pipe";
import { MatTableModule } from "@angular/material/table";
import { ServiceOrderUtils } from "./service-order.utils";
import { CustomersService } from "../../customers/customers.service";
import { Customer } from "../../customers/customers.types";
import { CnpjPipe } from "../../../shared/pipes/cnpj.pipe";
import { InputTableComponent } from "../../../shared/components/input-table/input-table.component";

@Component({
    selector: 'role-details',
    templateUrl: './details.component.html',
    styles: [`
        role-details {
            height: 100% !important;
        }

        .container-border {
            border-radius: 16px;
            padding: 16px;
        }

        .border-top {
            border-top: 1px solid gray;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, FuseFindByKeyPipe, DatePipe, DetailsHeaderComponent, MatMenuModule, CardOptionsComponent, ViewInputSwap, MatAutocompleteModule, FileManagerListComponent, AvailabilityPipe, MatTableModule, CurrencyPipe, JsonPipe, CnpjPipe, TitleCasePipe, InputTableComponent, AsyncPipe],
})
export class ServiceOrderDetailsComponent extends BaseDetailsComponent<ServiceOrderList, ServiceOrderList> implements OnInit, OnDestroy {
    identificationOptions: CardOptions[] = this._serviceOrderUtils.getIdentificationOptions();
    contractorOptions: CardOptions[] = this._serviceOrderUtils.getContractorOptions();
    serviceOptions: CardOptions[] = this._serviceOrderUtils.getServiceOptions();
    financialDataOptions: CardOptions[] = this._serviceOrderUtils.getFinancialDataOptions();
    formOhPaymentOptions: CardOptions[] = this._serviceOrderUtils.getFormOhPaymentOptions();
    displayedColumns: string[] = ['petitionName', 'typeDescription', 'fullDescription', 'term', 'value'];
    company: Customer;

    constructor(
        public _listComponent: ServiceOrderListComponent,
        private _service: ServiceOrdersService,
        private _customerService: CustomersService,
        private _serviceOrderUtils: ServiceOrderUtils,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _fuseConfirmation: FuseConfirmationService,
        public _alertService: AlertService,
        public _loaderService: LoaderService,
        private _matDialog: MatDialog,
    ) {
        super(_activatedRoute, _router, _listComponent, _service, _fuseConfirmation, _alertService, _loaderService);
    }

    buildForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [undefined],
            nome: ['', [Validators.required]],
        });
    }

    patchValues(): void {
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
