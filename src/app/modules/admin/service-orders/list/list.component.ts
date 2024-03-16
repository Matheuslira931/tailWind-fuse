import {
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    I18nPluralPipe,
    LowerCasePipe,
    NgClass,
    NgFor,
    NgIf,
    TitleCasePipe,
    UpperCasePipe
} from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ServiceOrdersService } from "../service-orders.service";
import { ServiceOrderList } from "../service-orders.types";
import { HeaderListComponent } from "../../../shared/components/header-list/header-list.component";
import { BaseListComponent } from "../../../shared/components/base/base-list.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CnpjCpfPipe } from "../../../shared/pipes/cnpj.cpf.pipe";
import { MatSortModule } from "@angular/material/sort";
import { TelefonePipe } from "../../../shared/pipes/telefone.pipe";
import { TruncatePipe } from "../../../shared/pipes/truncate.pipe";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { ListSelectorComponent } from "../../../shared/components/list-selector/list-selector.component";
import { Collaborator } from "../../../shared/models/collaborator.model";
import { CollaboratorService } from "../../../shared/services/collaborator.service";

@Component({
    selector: 'roles-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    styleUrls: ['./list.component.scss'],
    imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, HeaderListComponent, MatPaginatorModule, CnpjCpfPipe, LowerCasePipe, MatSortModule, TelefonePipe, TitleCasePipe, TruncatePipe, UpperCasePipe, DatePipe, MatMenuModule, MatRippleModule, ListSelectorComponent, CurrencyPipe],
})
export class ServiceOrderListComponent extends BaseListComponent<ServiceOrderList, ServiceOrderList> implements OnInit, OnDestroy {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedRecord: ServiceOrderList;
    listTitle = 'Ordens de Serviço';
    collaborators: Collaborator[] = [];
    subTitle: string;

    constructor(
        public _service: ServiceOrdersService,
        public _collaboratorService: CollaboratorService,
        public _router: Router,
    ) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
        this.subTitle = `Existem ${5} ordens de serviço com prioridade urgente`;
        this._collaboratorService.getItems().subscribe(collaborators => {
            this.collaborators = collaborators;
        });
    }

    onChooseCollaborator(collaborator: Collaborator): void {
        this.records$ = this._service.filterByCollaborator(collaborator.id);
    }

    onClearFilter(): void {
        this.loadRecords();
    }
}
