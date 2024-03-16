import { Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, filter, map, switchMap, tap } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { ProcessService } from "../process.service";
import { AsyncPipe, DatePipe, JsonPipe, NgClass, NgForOf, NgIf, TitleCasePipe } from "@angular/common";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CnpjCpfPipe } from "../../../shared/pipes/cnpj.cpf.pipe";
import { BrandingProcessHistory, Process, ProcessDetails } from "../process.types";
import { MovementType } from '../../movement/movement.enum';
import { ProcessDetailsComponent } from "../history-form/history-card.component";
import { FileManagerListComponent } from "../../../shared/components/attachments/list/list.component";
import { FileManagerDetailsComponent } from "../../../shared/components/attachments/details/details.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { Item } from "../../../shared/components/attachments/file-manager.types";
import { ProcessListComponent } from "../list/list.component";
import { MatInputModule } from "@angular/material/input";
import { LabelInputToggleComponent } from "../../../shared/components/label-input-toggle/label-input-toggle.component";
import { ActionsFormComponent } from "../../../shared/components/actions-form/actions-form.component";
import { StringUtils } from "../../../../../@fuse/services/utils/string-utils";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProcessFormComponent } from "../form/form.component";
import { TruncatePipe } from "../../../shared/pipes/truncate.pipe";
import { MatTooltipModule } from "@angular/material/tooltip";
import { environment } from "../../../../../environments/environment.prod";

const OVERALL_DATA_TAB_INDEX = 0;
const HISTORY_TAB_INDEX = 1;
const ATTACHMENT_TAB_INDEX = 2;

export interface TabOption {
    label: string;
    onClick: () => void;
}

@Component({
    selector: 'process-detailed',
    templateUrl: './detailed.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        process-detailed {
            height: 100%;
        }

        .rounded-image {
            border-radius: 50%;
        }

        .mat-mdc-tab-body-wrapper {
            height: 100%;
        }

        .last-col {
            min-width: 56px;
        }
    `],
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
        ProcessDetailsComponent,
        FileManagerListComponent,
        NgClass,
        FileManagerDetailsComponent,
        MatSidenavModule,
        MatInputModule,
        LabelInputToggleComponent,
        ActionsFormComponent,
        JsonPipe,
        ProcessFormComponent,
        TruncatePipe,
        MatTooltipModule,
        RouterOutlet
    ],
    providers: [TitleCasePipe]
})
export class ProcessDetailedComponent {
    record: Process;
    viewContent = new BehaviorSubject(null);
    processDetails!: any;
    processHistory!: BrandingProcessHistory[];
    currentTabIndex!: number;
    openedSideNav = false;
    selectedItem: Item;
    formChanged = true;
    openedSideForm = false;
    formGroup: FormGroup;
    showBriefSpecifications = true;
    readonly optionsByTab: Map<number, TabOption[]> = new Map([
        [OVERALL_DATA_TAB_INDEX, this.getOverallDataTabIndex()],
        [HISTORY_TAB_INDEX, this.getHistoryTabOptions()],
        [ATTACHMENT_TAB_INDEX, this.getAttachmentOptions()],
    ]);
    readonly routeByMovementType: Map<MovementType, string> = new Map([
        [MovementType.DISPATCH, 'new/history/dispatch'],
        [MovementType.FREE_TEXT, 'new/history/free-text'],
        [MovementType.PETITION, 'new/history/petition'],
    ]);
    readonly URL_PREFIX = environment.URL_API;

    constructor(private _router: Router,
                private _processService: ProcessService,
                private _processListComponent: ProcessListComponent,
                private _formBuilder: FormBuilder,
                private _activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.currentTabIndex = 0;
        this.watchRouteChangeToParentRoute();
        this._processService.getClosedHistoryForm$()
            .pipe(
                tap(() => this.openedSideForm = false),
                filter(() => this.currentTabIndex === HISTORY_TAB_INDEX),
            )
            .subscribe(() => this.reloadHistory());
        this._activatedRoute.paramMap.pipe(
            map((paramMap) => paramMap.get('id')),
            switchMap(id => this._processService.getDetails(+id)),
            switchMap((record) => {
                this.record = record;
                this.viewContent.next(record);
                this.handleProcessDetails(record.details);
                this.formGroup = this._formBuilder.group({
                    elementonominativo: [this.record?.brandingProcess[0]?.elementonominativo],
                    numeroprocesso: [this.record?.numeroprocesso, [Validators.required]],
                    apresentacao: [this.record?.brandingProcess[0]?.apresentacao, [Validators.required]],
                    situacaoRegistro: [this.record?.situacaoRegistro?.nome, [Validators.required]],
                    cnpj: [this.record?.processHolder[0]?.company?.cnpj, [Validators.required]],
                    prioridade: [this.record?.prioridade, [Validators.required]],
                    vigencia: [this.record?.details?.validity, [Validators.required]],
                });
                return this._processService.getHistory(this.record.id);
            }),
        ).subscribe((history: BrandingProcessHistory[]) => {
            this.processHistory = history;
        });
    }

    /**
     * The idea of this method is to verify if the route is in the detailed route and close the side form
     * @private
     */
    private watchRouteChangeToParentRoute(): void {
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(event => event as NavigationEnd),
            filter(event => event.urlAfterRedirects.endsWith('/details'))
        ).subscribe(event => {
            this.openedSideForm = false;
        });
    }

    redirectToList(): void {
        this._router.navigate(['./marcas']);
        this._processListComponent.fullscreen = false;
        this._processListComponent.matDrawer.close();
    }

    openNewProcessHistory(movementType: MovementType): void {
        const route = this.routeByMovementType.get(movementType);
        this.openedSideForm = true;
        this._router.navigate([route], {relativeTo: this._activatedRoute});
    }

    tabChanged(event: MatTabChangeEvent): void {
        this.handleSideNav(event);
        this.handleEditForm(event);
        this.currentTabIndex = event.index;
    }

    hasNextHistory(currentHistory: number): boolean {
        const indexes = this.processHistory.length - 1;
        return currentHistory < indexes;
    }

    hasSpecifications(): boolean {
        return !!this.record?.brandingProcess[0]?.brandingProcessClassesItem
            && this.record?.brandingProcess[0]?.brandingProcessClassesItem
                .filter(brandingProcess => !!brandingProcess.classItem || brandingProcess.textolivre).length > 0;
    }

    private mapStartAndEndDates<C>(value: string): Date[] {
        return value?.split('a')
            .map(date => date.trim())
            .map(date => new Date(date));
    }

    onFileSelect(item: Item): void {
        this.openedSideNav = true;
        this.selectedItem = item;
    }

    // todo: criar a partir do texto livro também, precisa criar uma lógca para isso
    buildSpecifications(): string {
        return this.record?.brandingProcess[0]?.brandingProcessClassesItem
            ?.filter(brandingProcess => brandingProcess.classItem || brandingProcess.textolivre)
            .map(brandingProcess => {
                if (brandingProcess.textolivre) {
                    const strings = brandingProcess.textolivre.split(';');
                    if (strings.length > 1) {
                        return strings.map(string => StringUtils.removeSpecialCharacters(string.trim()));
                    }
                    return StringUtils.removeSpecialCharacters(brandingProcess.textolivre);
                }
                return StringUtils.removeSpecialCharacters(brandingProcess.classItem.nome);
            })
            .filter(Boolean)
            .join("; ");
    }

    onClickEditData(): void {
        this.openedSideForm = true;
        this._router.navigate(['./edit'], {relativeTo: this._activatedRoute});
    }

    onCloseFileDetails(): void {
        this.openedSideNav = false;
    }

    hasFormChange(): boolean {
        return this.formChanged;
    }

    onCancel(): void {
        // todo: reset form
        this.formChanged = false;
    }

    private handleSideNav(event: MatTabChangeEvent): void {
        const differentFromAttachmentTab = event.index !== ATTACHMENT_TAB_INDEX;
        if (differentFromAttachmentTab) {
            this.openedSideNav = false;
        }
    }

    getOverallDataTabIndex(): any[] {
        return [
            {
                label: 'Atualizar'
            },
            {
                label: 'Editar dados',
                onClick: () => this.onClickEditData()
            },
        ];
    }

    getHistoryTabOptions(): any[] {
        return [
            {
                label: 'Atualizar'
            },
            {
                label: 'Adicionar Petição',
                onClick: () => this.openNewProcessHistory(MovementType.PETITION)
            },
            {
                label: 'Adicionar Despacho',
                onClick: () => this.openNewProcessHistory(MovementType.DISPATCH)
            },
            {
                label: 'Adicionar Texto Livre',
                onClick: () => this.openNewProcessHistory(MovementType.FREE_TEXT)
            }
        ];
    }

    getAttachmentOptions(): any[] {
        return [
            {
                label: 'Atualizar'
            }
        ];
    }

    onBackdropClicked(): void {
        this.openedSideForm = false;
    }

    onCancelEditForm(): void {
        this.openedSideForm = false;
    }

    private handleProcessDetails(processDetails: ProcessDetails): void {
        this.processDetails = processDetails;
        const ordinaryTermStartAndEndDates = this.mapStartAndEndDates(processDetails.ordinaryTerm);
        const extraordinaryTermStartAndEndDates = this.mapStartAndEndDates(processDetails.extraordinaryTerm);
        if (ordinaryTermStartAndEndDates) {
            this.processDetails = {
                ...processDetails,
                ordinaryTermStartDate: ordinaryTermStartAndEndDates[0],
                ordinaryTermEndDate: ordinaryTermStartAndEndDates[1],
            };
        }
        if (extraordinaryTermStartAndEndDates) {
            this.processDetails = {
                ...processDetails,
                extraordinaryTermStartDate: extraordinaryTermStartAndEndDates[0],
                extraordinaryTermEndDate: extraordinaryTermStartAndEndDates[1],
            };
        }
    }

    private handleEditForm(event: MatTabChangeEvent): void {
        const differentFromAttachmentTab = event.index !== OVERALL_DATA_TAB_INDEX;
        if (differentFromAttachmentTab) {
            this.openedSideForm = false;
        }
    }

    showAllSpecifications(): void {
        this.showBriefSpecifications = false;
    }

    onEditHistory(): void {
        this.openedSideForm = true;
    }

    private reloadHistory(): void {
        this._processService.getHistory(this.record.id)
            .subscribe(history => {
                this.processHistory = history;
            })
    }
}
