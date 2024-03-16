import {Directive, OnDestroy, OnInit} from '@angular/core';
import {MatDrawerToggleResult} from "@angular/material/sidenav";
import {catchError, filter, map, Subject, switchMap, throwError} from "rxjs";
import {OverlayRef} from "@angular/cdk/overlay";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseListComponent} from "./base-list.component";
import {ConfirmationDialogHelper} from "../../helpers/confirmation-dialog.helper";
import {FuseConfirmationService} from "../../../../../@fuse/services/confirmation";
import {BaseService} from "../../services/base.service";
import {BaseModel} from "../../models/base.model";
import {UntypedFormGroup} from "@angular/forms";
import {AlertType} from "../alert/alert.types";
import {AlertService} from "../alert/alert.service";
import {ObjectHelper} from "../../helpers/object.helper";
import {LoaderService} from "../../services/loader.service";

@Directive()
export abstract class BaseDetailsComponent<T, L extends BaseModel> implements OnInit, OnDestroy {
    record?: L;
    form: UntypedFormGroup;
    editMode: boolean = false;
    _tagsPanelOverlayRef: OverlayRef;
    _unsubscribeAll: Subject<any> = new Subject<any>();
    _router: Router;
    _activatedRoute: ActivatedRoute;
    _confirmationService: FuseConfirmationService;
    _alertService: AlertService;
    _loaderService: LoaderService;

    constructor(public activatedRoute: ActivatedRoute,
                public router: Router,
                public _listComponent: BaseListComponent<T, L>,
                public _baseService: BaseService<T, L>,
                public confirmationService: FuseConfirmationService,
                public alertService: AlertService,
                public loaderService: LoaderService) {
        this._router = router;
        this._activatedRoute = activatedRoute;
        this._alertService = alertService;
        this._confirmationService = confirmationService;
        this._loaderService = loaderService;
    }

    ngOnInit(): void {
        this._listComponent.matDrawer.open();

        this.form = this.buildForm();

        this._activatedRoute.paramMap
            .pipe(
                map(paramMap => paramMap.get('id')),
                switchMap(id => this._baseService.getById(+id)),
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
                this.patchValues();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        this._router.navigate(['..'], {relativeTo: this._activatedRoute});
        return this._listComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (this.editMode && !this.record) {
            this.closeDrawer();
        }
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    delete(): void {
        const confirmConfig = ConfirmationDialogHelper.buildRemovalConfirmationDialog();
        const dialogRef = this._confirmationService.open(confirmConfig);

        dialogRef.afterClosed()
            .pipe(
                filter((result) => result === 'confirmed'),
                map(() => this.record?.id),
                switchMap(id => this._baseService.deleteById(id)),
                this.handleError()
            )
            .subscribe(() => {
                this.handleRequestSuccess(AlertType.DELETE_SUCCESS);
            });
    }

    save(): void {
        const object = this.form.getRawValue() as T;
        if (this.record?.id) {
            this._baseService.update(object)
                .pipe(this.handleError())
                .subscribe(() => this.handleRequestSuccess(AlertType.UPDATE_SUCCESS));
            return;
        }

        this._baseService.save(ObjectHelper.removeNullFields(object) as T)
            .pipe(this.handleError())
            .subscribe(() => this.handleRequestSuccess(AlertType.INSERT_SUCCESS));
    }

    handleError() {
        return catchError(err => {
            this._alertService.show(AlertType.ERROR);
            return throwError(err);
        });
    }

    handleRequestSuccess(alertType: AlertType): void {
        this.closeDrawer();
        this._alertService.show(alertType);
        this._listComponent.records$ = this._baseService.getItemsPaged();
    }

    abstract buildForm(): UntypedFormGroup;

    abstract patchValues(): void;
}
