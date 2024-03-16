import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { NgForOf, NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MovementList, ProcessHistoryDetail } from "../../movement.model";
import { DetailsHeaderComponent } from "../../../../shared/components/details-header/details-header.component";
import { ActionsFormComponent } from "../../../../shared/components/actions-form/actions-form.component";
import { catchError, filter, map, switchMap, tap, throwError } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ProcessService } from "../../../process/process.service";
import { MovementService } from "../../movement.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { AlertType } from "../../../../shared/components/alert/alert.types";
import { AlertService } from "../../../../shared/components/alert/alert.service";
import { ConfirmationDialogHelper } from "../../../../shared/helpers/confirmation-dialog.helper";
import { FuseConfirmationService } from "../../../../../../@fuse/services/confirmation";

const PETITION_MOVEMENT_TYPE = 2;

@Component({
    selector: 'petition-form',
    templateUrl: './petition.component.html',
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
        NgForOf,
        MatFormFieldModule,
        MatNativeDateModule
    ],
    styles: [`
        :host {
            height: 100% !important;
        }
    `],
    standalone: true
})
export class PetitionFormComponent implements OnInit {
    form: UntypedFormGroup;
    movementList!: MovementList[];
    record!: ProcessHistoryDetail;
    processId!: number;
    historyId!: number;
    editMode = false;

    constructor(private _formBuilder: FormBuilder,
                private _activatedRoute: ActivatedRoute,
                private _processService: ProcessService,
                private _alertService: AlertService,
                private _confirmationService: FuseConfirmationService,
                private _movementService: MovementService) {
    }

    ngOnInit(): void {
        this.form = this.buildForm();
        this.loadMovementTypes();
        this.loadProcessId();
        this.handleEditMode();
    }

    private handleError() {
        return catchError(err => {
            this._alertService.show(AlertType.ERROR);
            return throwError(err);
        });
    }

    buildForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [undefined],
            petition: [undefined],
            protocolDate: ['', [Validators.required]],
            protocolNumber: ['', [Validators.required]],
        });
    }

    onclickSave(): void {
        const form = this.form.getRawValue() as FormValue;
        const payload: Partial<ProcessHistoryDetail> = {
            id: this.historyId,
            processId: this.processId,
            movementId: form.petition.id,
            protocolNumber: form.protocolNumber,
            protocolDate: form.protocolDate,
            type: 2
        }
        if (this.editMode) {
            this._processService.updateHistory(payload)
                .pipe(this.handleError())
                .subscribe(value => {
                    this._alertService.show(AlertType.UPDATE_SUCCESS);
                    this._processService.emitClosedHistoryForm();
                });
            return;
        }
        this._processService.saveHistory(payload)
            .pipe(this.handleError())
            .subscribe(value => {
                this._alertService.show(AlertType.INSERT_SUCCESS);
                this._processService.emitClosedHistoryForm();
            });
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

    private loadProcessId(): void {
        this._activatedRoute.parent.params
            .pipe(
                map((params: { id: number }) => params.id),
                filter(Boolean),
                tap(processId => this.processId = processId)
            )
            .subscribe();
    }

    getMovementName(movement: MovementList): string {
        return movement?.nome;
    }

    onClickCancel(): void {
        this._processService.emitClosedHistoryForm();
    }

    private handleEditMode(): void {
        this._activatedRoute.params
            .pipe(
                map((params: { id: number }) => params.id),
                filter(Boolean),
                tap(() => this.editMode = true),
                switchMap((id) => {
                    this.historyId = id;
                    return this._processService.getHistoryById(id, PETITION_MOVEMENT_TYPE);
                }),
                switchMap((record) => {
                    this.record = record;
                    const data = {
                        protocolDate: record.protocolDate,
                        protocolNumber: record.protocolNumber,
                    };

                    this.form.patchValue(data);
                    return this._movementService.getById(record.movementId);
                })
            )
            .subscribe((movement) => {
                this.form.patchValue({
                    petition: movement
                });
            });
    }

    private loadMovementTypes(): void {
        this._movementService.getMovementsByType(PETITION_MOVEMENT_TYPE)
            .subscribe(movementList => {
                this.movementList = movementList;
            });
    }
}

interface FormValue {
    id?: number;
    protocolDate: Date;
    protocolNumber: number;
    petition: ProcessHistoryDetail;
}
