import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
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
import { ProcessService } from "../process.service";
import { ProcessListComponent } from "../list/list.component";
import { DetailsHeaderComponent } from "../../../shared/components/details-header/details-header.component";
import { BaseDetailsComponent } from "../../../shared/components/base/base-details.component";
import { AlertService } from "../../../shared/components/alert/alert.service";
import { LoaderService } from "../../../shared/services/loader.service";
import { Process, ProcessList } from "../process.types";
import { CnpjCpfPipe } from "../../../shared/pipes/cnpj.cpf.pipe";
import { StringUtils } from "../../../../../@fuse/services/utils/string-utils";
import { TruncatePipe } from "../../../shared/pipes/truncate.pipe";
import { environment } from "../../../../../environments/environment.prod";

@Component({
    selector: 'process-details',
    templateUrl: './details.component.html',
    styles: [`
        customers-details {
            height: 100% !important;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, FuseFindByKeyPipe, DatePipe, DetailsHeaderComponent, CnpjCpfPipe, TitleCasePipe, TruncatePipe],
    providers: [TitleCasePipe]
})
export class ProcessDetailsComponent extends BaseDetailsComponent<ProcessList, Process> {
    form: UntypedFormGroup;
    showBriefSpecifications = true;
    readonly URL_PREFIX = environment.URL_API;

    constructor(
        public _listComponent: ProcessListComponent,
        public _service: ProcessService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _confirmationService: FuseConfirmationService,
        public _router: Router,
        public _alertService: AlertService,
        public _loaderService: LoaderService,
    ) {
        super(_activatedRoute, _router, _listComponent, _service, _confirmationService, _alertService, _loaderService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    patchValues(): void {
        console.log('this.record');
        console.log(this.record);
        console.log(this.URL_PREFIX + this.record.brandingProcess[0].urlLogo);

    }

    hasSpecifications(): boolean {
        return !!this.record?.brandingProcess[0]?.brandingProcessClassesItem
            && this.record?.brandingProcess[0]?.brandingProcessClassesItem
                .filter(brandingProcess => !!brandingProcess.classItem || brandingProcess.textolivre).length > 0;
    }

    buildSpecifications(): string {
        console.log('brandingProcessClassesItem');
        console.log(this.record?.brandingProcess[0]?.brandingProcessClassesItem);
        return this.record?.brandingProcess[0]?.brandingProcessClassesItem
            ?.filter(brandingProcess => brandingProcess.classItem || brandingProcess.textolivre)
            .map(brandingProcess => {
                if (brandingProcess.textolivre) {
                    const strings = brandingProcess.textolivre.split(';');
                    if (strings.length > 1) {
                        return strings.map(string => StringUtils.removeSpecialCharacters(string.trim()))
                    }
                    return StringUtils.removeSpecialCharacters(brandingProcess.textolivre);
                }
                return StringUtils.removeSpecialCharacters(brandingProcess.classItem.nome);
            })
            .filter(Boolean)
            .join("; ");
    }

    buildForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [undefined],
            nome: ['', [Validators.required]],
        });
    }

    onClickEdit(): void {
        this._router.navigate(['details'], {relativeTo: this._activatedRoute});
        this._service.emitFullScreen();
    }

    showAllSpecifications(): void {
        this.showBriefSpecifications = false;
    }
}
