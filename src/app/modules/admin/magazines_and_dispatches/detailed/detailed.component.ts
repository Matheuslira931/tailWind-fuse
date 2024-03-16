import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, CurrencyPipe, DatePipe, JsonPipe, NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {CnpjCpfPipe} from "../../../shared/pipes/cnpj.cpf.pipe";
import {FileManagerListComponent} from "../../../shared/components/attachments/list/list.component";
import {FileManagerDetailsComponent} from "../../../shared/components/attachments/details/details.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatInputModule} from "@angular/material/input";
import {LabelInputToggleComponent} from "../../../shared/components/label-input-toggle/label-input-toggle.component";
import {ActionsFormComponent} from "../../../shared/components/actions-form/actions-form.component";
import {ProcessDetailsComponent} from "../../process/history-form/history-card.component";
import {ProcessFormComponent} from "../../process/form/form.component";
import {ListSelectorComponent} from "../../../shared/components/list-selector/list-selector.component";
import {Collaborator} from "../../../shared/models/collaborator.model";
import {HeaderListComponent} from "../../../shared/components/header-list/header-list.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {DashboardService} from '../../dashboards/project/dashboard.service';
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@Component({
    selector: 'magazines-and-dispatches',
    templateUrl: './detailed.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        NgIf,
        MatMenuModule,
        MatTabsModule,
        MatProgressBarModule,
        DatePipe,
        CnpjCpfPipe,
        TitleCasePipe,
        AsyncPipe,
        NgForOf,
        FileManagerListComponent,
        NgClass,
        FileManagerDetailsComponent,
        MatSidenavModule,
        MatInputModule,
        LabelInputToggleComponent,
        ActionsFormComponent,
        JsonPipe,
        ProcessDetailsComponent,
        ProcessFormComponent,
        ListSelectorComponent,
        HeaderListComponent,
        MatSlideToggleModule,
        CurrencyPipe,
        MatSortModule,
        MatTableModule,
        MatButtonToggleModule,
    ],
    providers: [TitleCasePipe]
})
export class MagazineAndDispatchesComponent implements OnInit {
    openedSideNav = false;
    openedSideForm = false;
    options: any[] = [];
    isLoading: boolean = false;
    data: any = [];

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        this.data = [
            {
                title: 'Test',
                status: 'Status'
            },
            {
                title: 'Test',
                status: 'Status'
            },
            {
                title: 'Test',
                status: 'Status'
            }
        ]
    }

    onBackdropClicked(): void {
        this.openedSideNav = false;
    }

    onCancelEditForm(): void {
        this.openedSideForm = false;
    }

    onChoose(collaborator: Collaborator): void {

    }

    onClearFilter(): void {

    }

    search(query: string): void {

    }

    new(): void {

    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
