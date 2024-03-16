import { NgIf } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { catchError, filter, map, of, Subject, switchMap, throwError } from 'rxjs';
import { Item } from "../file-manager.types";
import { ConfirmationDialogHelper } from "../../../helpers/confirmation-dialog.helper";
import { FuseConfirmationService } from "../../../../../../@fuse/services/confirmation";
import { AlertType } from "../../alert/alert.types";
import { AlertService } from "../../alert/alert.service";

@Component({
    selector: 'file-manager-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule, NgIf],
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('inputFile') inputFile!: ElementRef;
    @Input() item: Item;
    @Output() onRemove = new EventEmitter<Item>();
    @Output() closed = new EventEmitter<void>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _confirmationService: FuseConfirmationService,
        public alertService: AlertService,
    ) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    onRemoveFile(): void {
        const confirmConfig = ConfirmationDialogHelper.buildRemovalConfirmationDialog();
        const dialogRef = this._confirmationService.open(confirmConfig);

        dialogRef.afterClosed()
            .pipe(
                filter((result) => result === 'confirmed'),
                map(() => this.item?.id),
                switchMap(id => of(true)),
                catchError((err) => {
                    this.alertService.show(AlertType.ERROR);
                    return throwError(err);
                })
            )
            .subscribe(() => {
                this.alertService.show(AlertType.DELETE_SUCCESS);
            });
    }

    onClose(): void {
        this.closed.emit();
    }

    uploadFile(event: Event): void {

    }

    openFileWindow(): void {
        this.inputFile.nativeElement.click();
    }
}
