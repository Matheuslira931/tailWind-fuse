import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {DatePipe, JsonPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {BrandingProcessHistory, BrandingProcessMovement} from "../process.types";
import {ActivatedRoute, Router} from "@angular/router";

const DISPATCH_TYPE_NUMBER = 1;
const PETITION_TYPE_NUMBER = 2;
const FREE_TEXT_TYPE_NUMBER = 3;
@Component({
    selector: 'history-card',
    templateUrl: './history-card.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        NgIf,
        MatIconModule,
        MatMenuModule,
        DatePipe,
        JsonPipe
    ],
})
export class ProcessDetailsComponent {
    @Input() history: BrandingProcessHistory;
    @Input() showConnectionLine = false;
    @Output() editingHistory = new EventEmitter<void>();
    readonly routeByMovementType: Map<number, string> = new Map([
        [DISPATCH_TYPE_NUMBER, 'history/dispatch'],
        [FREE_TEXT_TYPE_NUMBER, 'history/free-text'],
        [PETITION_TYPE_NUMBER, 'history/petition'],
    ]);

    constructor(private _router: Router,
                private _activatedRoute: ActivatedRoute) {
    }

    openCardDetails(history: BrandingProcessMovement): void {
        console.log('history');
        console.log(history);
        const route = this.routeByMovementType.get(history.type);
        const editRoute = `${route}/${history.id}`;
        console.log('editRoute');
        console.log(editRoute);
        this._router.navigate([editRoute], {relativeTo: this._activatedRoute});
        this.editingHistory.emit();
        // this._processService.getHistoryById(history.id, history.type)
        //     .subscribe((movement) => {
        //         // this._matDialog.open(MovementFormComponent, {
        //         //     width: '600px',
        //         //     data: {
        //         //         ...movement,
        //         //         processNumber: history.processNumber
        //         //     },
        //         //     panelClass: 'no-padding-container'
        //         // });
        //     });
    }

    openConfirmationDialog(history: BrandingProcessHistory): void {
        // this._matDialog.open(ConfirmationDialogComponent)
        //     .afterClosed()
        //     .pipe(
        //         filter(Boolean),
        //         switchMap(() => this._processService.deleteHistory(history.id, history.type)),
        //         switchMap(() => this._processService.getHistory(this.record.id))
        //     )
        //     .subscribe((processHistories) => {
        //         this.processHistory = processHistories;
        //     });
    }
}
