import {TextFieldModule} from '@angular/cdk/text-field';
import {AsyncPipe, DatePipe, NgClass, NgFor, NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatOptionModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FuseFindByKeyPipe} from '@fuse/pipes/find-by-key/find-by-key.pipe';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {CustomersService} from "../customers.service";
import {AlertService} from "../../../shared/components/alert/alert.service";
import {LoaderService} from "../../../shared/services/loader.service";
import {Customer, CustomerList, CustomerType} from "../customers.types";
import {CustomersListComponent} from "../list/list.component";
import {DetailsHeaderComponent} from "../../../shared/components/details-header/details-header.component";
import {BaseDetailsComponent} from "../../../shared/components/base/base-details.component";
import {CustomerPjViewComponent} from "./views/pj/customer-pj-view.component";
import {CustomerPfViewComponent} from "./views/pf/customer-pf-view.component";
import {CustomerPjComponent} from "./forms/customer-pj/customer-pj.component";
import {CustomerPfComponent} from "./forms/customer-pf/customer-pf.component";
import {catchError, EMPTY, filter, map, switchMap, throwError} from "rxjs";
import {AlertType} from "../../../shared/components/alert/alert.types";

@Component({
    selector: 'customers-details',
    templateUrl: './details.component.html',
    styles: [`
      customers-details {
        height: 100% !important;
      }
    `],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, FuseFindByKeyPipe, DatePipe, DetailsHeaderComponent, CustomerPjViewComponent, CustomerPfViewComponent, CustomerPjComponent, CustomerPfComponent, AsyncPipe],
})
export class CustomerDetailsComponent extends BaseDetailsComponent<CustomerList, Customer> implements OnInit, OnDestroy {
    @ViewChild('pfForm') pessoaFisicaComponent: CustomerPfComponent;
    @ViewChild('pjFormComponent') pessoaJuridicaComponent: CustomerPjComponent;
    showPessoaFisicaForm: boolean;

    constructor(
        public _router: Router,
        public _listComponent: CustomersListComponent,
        private _service: CustomersService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _fuseConfirmation: FuseConfirmationService,
        public _alertService: AlertService,
        public _loaderService: LoaderService,
    ) {
        super(_activatedRoute, _router, _listComponent, _service, _fuseConfirmation, _alertService, _loaderService);
    }

    ngOnInit() {
        this._listComponent.matDrawer.open();

        this.form = this.buildForm();

        this._activatedRoute.paramMap
            .pipe(
                map(paramMap => paramMap.get('id')),
                switchMap(id => {
                    if (!id) {
                        this.toggleEditMode(true);
                        return EMPTY;
                    }
                    return this._baseService.getById(+id);
                }),
                filter(record => {
                    if (!record) {
                        this.toggleEditMode(true);
                        return !!record;
                    }
                    this.loaderService.toggle();
                    return !!record;
                }),
                catchError((err, caught) => {
                    this._alertService.show(AlertType.ERROR);
                    this.loaderService.toggle();
                    return throwError(err);
                }),
            )
            .subscribe(record => {
                this.loaderService.toggle();
                this.record = record;
            });
        this.setShouldShowPessoaFisica();
    }

    save(): void {
        const payload = this.getPayload();
        if (payload.id) {
            this._service.update(payload)
                .pipe(this.handleError())
                .subscribe(() => this.handleRequestSuccess(AlertType.UPDATE_SUCCESS));
            return;
        }
        this._service.save(payload)
            .pipe(this.handleError())
            .subscribe(() => this.handleRequestSuccess(AlertType.INSERT_SUCCESS));
    }

    handleRequestSuccess(alertType: AlertType) {
        super.handleRequestSuccess(alertType);
        this._listComponent.reloadList();
    }

    buildForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [undefined],
            nome: ['', [Validators.required]],
        });
    }

    patchValues(): void {
    }

    private setShouldShowPessoaFisica(): void {
        this._activatedRoute.queryParams
            .subscribe((params: { customerType: CustomerType }) =>
                this.showPessoaFisicaForm = CustomerType.PF === params.customerType
            );
    }

    private getPayload(): any {
        if (this.showPessoaFisicaForm) {
            return this.pessoaFisicaComponent.buildPayload();
        }
        return this.pessoaJuridicaComponent.buildPayload();
    }
}
