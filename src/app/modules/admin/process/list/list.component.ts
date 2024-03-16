import {
    AsyncPipe,
    DatePipe,
    I18nPluralPipe,
    LowerCasePipe,
    NgClass,
    NgFor,
    NgIf,
    TitleCasePipe,
    UpperCasePipe
} from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProcessService } from "../process.service";
import { BaseListComponent } from "../../../shared/components/base/base-list.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { CnpjCpfPipe } from "../../../shared/pipes/cnpj.cpf.pipe";
import { TelefonePipe } from "../../../shared/pipes/telefone.pipe";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { TruncatePipe } from "../../../shared/pipes/truncate.pipe";
import { Process, ProcessList } from "../process.types";
import { Page } from "../../../shared/models/page.model";
import { ListComponent } from "../../../shared/components/list/list.component";
import { HttpParams } from "@angular/common/http";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { HeaderListComponent } from "../../../shared/components/header-list/header-list.component";
import { ListSelectorComponent } from "../../../shared/components/list-selector/list-selector.component";
import { CollaboratorService } from "../../../shared/services/collaborator.service";
import { Collaborator } from "../../../shared/models/collaborator.model";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ObjectUtils } from "../../../shared/utils/object-utils";
import { environment } from "../../../../../environments/environment.prod";

export interface FilterState {
    Internal: boolean;
    InExtension: boolean;
    OrderBy?: string;
    OnlyActive: boolean;
}

@Component({
    selector: 'process-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, MatMenuModule, MatPaginatorModule, TitleCasePipe, CnpjCpfPipe, TelefonePipe, MatSortModule, LowerCasePipe, UpperCasePipe, TruncatePipe, ListComponent, MatSlideToggleModule, HeaderListComponent, ListSelectorComponent, DatePipe, MatTooltipModule],
    providers: [DatePipe]
})
export class ProcessListComponent extends BaseListComponent<ProcessList, Process> {
    @ViewChild(MatSort) matSort: MatSort;

    listTitle: string = 'Processos de Marca';
    readonly URL_PREFIX = environment.URL_API;
    sort!: Sort;
    page: Page<any> = this.buildInitialPage();
    fullscreen = false;
    collaborators: Collaborator[] = [];
    filterState: FilterState = {
        OnlyActive: true,
        Internal: true,
        InExtension: false
    };

    constructor(
        public _service: ProcessService,
        public _collaboratorService: CollaboratorService,
    ) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
        this._collaboratorService.getItems().subscribe(collaborators => {
            this.collaborators = collaborators;
        });
        this.updateList();
        this._service.getFullscreen$().subscribe(() => {
            this.fullscreen = true;
        });
    }

    private updateList(): void {
        this.records$.subscribe(page => {
            console.log('page');
            console.log(page);
            this.page = page;
            this.length = page.totalRecords;
        });
    }

    onNavigationEnd(): void {
        this.fullscreen = false;
    }

    newProcess(): void {
    }

    search(query: string): void {
        this.records$ = this._service.search(query);
        this.records$.subscribe(page => {
            this.page = page;
        })
    }

    private buildInitialPage(): Page<any> {
        return {
            records: [],
            totalRecords: 20,
            currentPage: 0,
            pageSize: 50,
            totalPages: 200,
            hasNext: true,
            hasPrevious: false
        };
    }

    onChooseCollaborator(collaborator: Collaborator): void {
        this._service.filterByCollaborator(collaborator.id).subscribe(response => {
            this.page = response;
        });
    }

    sortData(sortEvent: Sort): void {
        this.sort = sortEvent;
        const httpParams = new HttpParams({
            fromObject: {
                PageNumber: this.pageIndex + 1,
                PageSize: this.pageSize,
                OrderBy: `${sortEvent.active} ${sortEvent.direction}`
            }
        });
        this._service.fetchByParams(httpParams).subscribe(page => {
            this.page = page;
        });
    }

    onClearFilter(): void {
        this.resetSorting();
        this.records$.subscribe(page => {
            this.page = page;
        });
    }

    resetSorting(): void {
        this.sort = null;
        this.matSort?.sort({id: null, start: 'asc', disableClear: true});
    }

    handlePageEvent(e: PageEvent) {
        super.handlePageEvent(e);
        this.records$.subscribe(page => {
            this.page = page;
        })
    }
    onChangeSituationFilterFlag({checked}: MatSlideToggleChange): void {
        this.filterState.OnlyActive = checked;
        this.records$ = this._service.fetchByParams(this.buildHttpParams());
        this.updateList();
    }

    private buildHttpParams(): HttpParams {
        const filteredParams = ObjectUtils.removeNullOrFalseValues(this.filterState);
        return new HttpParams({
            fromObject: {
                PageNumber: this.pageIndex + 1,
                PageSize: this.pageSize,
                ...filteredParams
            }
        });
    }

    onChangeExternalFilterFlag({checked}: MatSlideToggleChange): void {
        this.filterState.Internal = checked;
        this.records$ = this._service.fetchByParams(this.buildHttpParams());
        this.updateList();
    }

    onChangeProrrogacaoFilterFlag({checked}: MatSlideToggleChange): void {
        this.filterState.InExtension = checked;
        this.records$ = this._service.fetchByParams(this.buildHttpParams());
        this.updateList();
    }
}
