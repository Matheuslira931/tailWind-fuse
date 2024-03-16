import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { NgIf, TitleCasePipe } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MovementList, ProcessHistoryDetail } from "../../movement.model";
import { MagazineList } from "../../../../shared/models/magazine.model";
import { DetailsHeaderComponent } from "../../../../shared/components/details-header/details-header.component";
import { ActionsFormComponent } from "../../../../shared/components/actions-form/actions-form.component";
import { ProcessService } from "../../../process/process.service";
import { catchError, filter, map, switchMap, tap, throwError } from "rxjs";
import { AlertType } from "../../../../shared/components/alert/alert.types";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "../../../../shared/components/alert/alert.service";
import { FuseConfirmationService } from "../../../../../../@fuse/services/confirmation";
import { MovementService } from "../../movement.service";
import { ConfirmationDialogHelper } from "../../../../shared/helpers/confirmation-dialog.helper";

const DISPATCH_MOVEMENT_TYPE = 1;

@Component({
    selector: 'dispatch-form',
    templateUrl: './dispatch-form.component.html',
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
        TitleCasePipe,
        ActionsFormComponent,
    ],
    styles: [`
        :host {
            height: 100% !important;
        }
    `],
    standalone: true
})
export class DispatchFormComponent implements OnInit {
    form: UntypedFormGroup;
    movementList!: MovementList[];
    magazineList!: MagazineList[];
    historyId!: number;
    processId!: number;
    record!: ProcessHistoryDetail;

    constructor(private _formBuilder: FormBuilder,
                private _processService: ProcessService,
                private _activatedRoute: ActivatedRoute,
                private _alertService: AlertService,
                private _confirmationService: FuseConfirmationService,
                private _movementService: MovementService) {
    }

    ngOnInit(): void {
        this.form = this.buildForm();
        this.loadMovementTypes();
        this.loadProcessId();
    }

    buildForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [undefined],
            dispatch: ['', [Validators.required]],
            nome: ['', [Validators.required]],
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

    getMovementName(movement: MovementList): string {
        return movement?.nome;
    }

    getMagazineName(magazine: MagazineList): string {
        return magazine?.numerorevista;
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

    private loadMovementTypes(): void {
        this._movementService.getMovementsByType(DISPATCH_MOVEMENT_TYPE)
            .subscribe(movementList => {
                this.movementList = movementList;
            });
    }
}
