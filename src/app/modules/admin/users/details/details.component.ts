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
import {UsersService} from "../users.service";
import {UsersListComponent} from "../list/list.component";
import {User, UserList} from "../users.types";
import {AvailabilityPipe} from "../../../shared/pipes/availability.pipe";
import {AlertService} from "../../../shared/components/alert/alert.service";
import {DetailsHeaderComponent} from "../../../shared/components/details-header/details-header.component";
import {BaseDetailsComponent} from "../../../shared/components/base/base-details.component";
import {FuseConfirmationService} from "../../../../../@fuse/services/confirmation";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {LoaderService} from "../../../shared/services/loader.service";

const ADMIN_USER_ID = 2;

@Component({
    selector: 'users-details',
    templateUrl: './details.component.html',
    styles: [`
        users-details {
            height: 100% !important;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, FuseFindByKeyPipe, DatePipe, AvailabilityPipe, DetailsHeaderComponent, MatSlideToggleModule],
})
export class UserDetailsComponent extends BaseDetailsComponent<UserList, User> implements OnInit, OnDestroy {
    disableActionButtons = false;

    constructor(
        public _service: UsersService,
        public _alertService: AlertService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _listComponent: UsersListComponent,
        public _fuseConfirmation: FuseConfirmationService,
        public _loaderService: LoaderService,
    ) {
        super(_activatedRoute, _router, _listComponent, _service, _fuseConfirmation, _alertService, _loaderService);
    }

    buildForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [this.record?.id],
            nome: [this.record?.nome, [Validators.required]],
            ativo: [this.record?.ativo ?? true, [Validators.required]],
            email: [this.record?.email, [Validators.required, Validators.email]],
            password: [''],
            passwordConfirm: [''],
        })!;
    }

    patchValues(): void {
        this.form.patchValue({
            id: this.record.id,
            nome: this.record.nome,
            ativo: this.record.ativo,
            email: this.record.email,
        });
    }

    shouldShowPasswordInput(): boolean {
        return this.record?.id !== ADMIN_USER_ID;
    }

    ativoChanged(): void {
        const updatedValue = !this.form.get('ativo')?.getRawValue();
        this.form.get('ativo')?.setValue(updatedValue);
    }
}
