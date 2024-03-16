import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { DetailsHeaderComponent } from "../../../../shared/components/details-header/details-header.component";
import { ActionsFormComponent } from "../../../../shared/components/actions-form/actions-form.component";
import { ProcessService } from "../../../process/process.service";
import { AlertService } from "../../../../shared/components/alert/alert.service";
import { FuseConfirmationService } from "../../../../../../@fuse/services/confirmation";
import { catchError, filter, map, switchMap, tap, throwError } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ConfirmationDialogHelper } from "../../../../shared/helpers/confirmation-dialog.helper";
import { AlertType } from "../../../../shared/components/alert/alert.types";
import { ProcessHistoryDetail } from "../../movement.model";


@Component({
    selector: 'free-text-form',
    templateUrl: './free-text-form.component.html',
    imports: [
        MatTabsModule,
        MatIconModule,
        NgIf,
        MatInputModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatButtonModule,
        DetailsHeaderComponent,
        ActionsFormComponent,
    ],
    styles: [`
        :host {
            height: 100% !important;
        }
    `],
    standalone: true
})
export class FreeTextFormComponent implements OnInit {
    form: UntypedFormGroup;
    processId: number;
    record!: ProcessHistoryDetail;
    historyId!: number;
    editMode = false;

    constructor(private _formBuilder: FormBuilder,
                private _processService: ProcessService,
                private _activatedRoute: ActivatedRoute,
                private _alertService: AlertService,
                private _confirmationService: FuseConfirmationService) {
    }

    ngOnInit(): void {
        this.form = this.buildForm();
        this.loadProcessId();
    }

    onClickDelete(): void {
        const confirmConfig = ConfirmationDialogHelper.buildRemovalConfirmationDialog();
        const dialogRef = this._confirmationService.open(confirmConfig);

        dialogRef.afterClosed()
            .pipe(
                filter((result) => result === 'confirmed'),
                map(() => this.record?.id),
                switchMap(id => this._processService.deleteHistory(this.historyId)),
                this.handleError()
            )
            .subscribe(() => this._alertService.show(AlertType.DELETE_SUCCESS));
    }

    buildForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [undefined],
            nome: ['', [Validators.required]],
        });
    }

    onClickCancel(): void {
        this._processService.emitClosedHistoryForm();
    }

    onclickSave(): void {

    }

    private loadProcessId(): void {
        this._activatedRoute.parent.params
            .pipe(
                map((params: { id: number }) => params.id),
                filter(Boolean),
                tap(processId => this.processId = processId)
            )
            .subscribe();
    }

    private handleError() {
        return catchError(err => {
            this._alertService.show(AlertType.ERROR);
            return throwError(err);
        });
    }
}
