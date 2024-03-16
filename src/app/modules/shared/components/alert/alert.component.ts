import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAlertComponent } from "../../../../../@fuse/components/alert";
import { AlertService } from "./alert.service";
import { AlertType } from "./alert.types";
import { NgIf } from "@angular/common";

const TWO_SECONDS = 3000;

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    styles: [`
        alert {
            width: 100%;
            position: absolute;
            display: flex;
            justify-content: center;
            margin-bottom: 32px;
            bottom: 0;
            z-index: 9999;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseAlertComponent,
        NgIf
    ],
})
export class AlertComponent implements OnInit {
    showByTypeName = new Map<AlertType, boolean>([
        [AlertType.INSERT_SUCCESS, false],
        [AlertType.UPDATE_SUCCESS, false],
        [AlertType.DELETE_SUCCESS, false],
        [AlertType.ERROR, false],
    ]);

    constructor(private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.alertService.getAlert$().subscribe((type) => {
            this.showByTypeName.set(type, true);
            setTimeout(() => this.showByTypeName.set(type, false), TWO_SECONDS);
        });
    }

    protected readonly AlertType = AlertType;
}
