import {TextFieldModule} from '@angular/cdk/text-field';
import {DatePipe, NgClass, NgFor, NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
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
import {RolesService} from "../roles.service";
import {RolesListComponent} from "../list/list.component";
import {Position} from "../roles.types";
import {AlertService} from "../../../shared/components/alert/alert.service";
import {DetailsHeaderComponent} from "../../../shared/components/details-header/details-header.component";
import {BaseDetailsComponent} from "../../../shared/components/base/base-details.component";
import {LoaderService} from "../../../shared/services/loader.service";

@Component({
    selector: 'role-details',
    templateUrl: './details.component.html',
    styles: [`
        role-details {
          height: 100% !important;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, FuseFindByKeyPipe, DatePipe, DetailsHeaderComponent],
})
export class RolesDetailsComponent extends BaseDetailsComponent<Position, Position> implements OnInit, OnDestroy {
    constructor(
        public _listComponent: RolesListComponent,
        private _service: RolesService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _fuseConfirmation: FuseConfirmationService,
        public _alertService: AlertService,
        public _loaderService: LoaderService,
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
        this.form.patchValue({
            id: this.record.id,
            nome: this.record.nome
        });
    }
}
