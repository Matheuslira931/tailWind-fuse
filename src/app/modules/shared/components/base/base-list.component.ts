import {Directive, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MatDrawer} from '@angular/material/sidenav';
import {ActivatedRoute, EventType, NavigationEnd, Router} from '@angular/router';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {filter, map, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {FuseConfirmationService} from "../../../../../@fuse/services/confirmation";
import {Page} from "../../models/page.model";
import {BaseService} from "../../services/base.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Directive()
export abstract class BaseListComponent<T, L> implements OnInit, OnDestroy {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    isLoading = false;
    length = 100;
    pageSize = 50;
    pageIndex = 0;
    pageEvent: PageEvent;
    emptyMessage = 'Não existem registros.';
    protected readonly pageSizeOptions = [50, 100, 200];
    records$: Observable<Page<T>>;
    drawerMode: 'side' | 'over' = 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedRecord: T;
    _unsubscribeAll: Subject<any> = new Subject<any>();
    listTitle: string = 'Usuários';
    _activatedRoute: ActivatedRoute;
    _confirmationService: FuseConfirmationService;
    public _router: Router;
    _fuseMediaWatcherService: FuseMediaWatcherService;

    constructor(public _service: BaseService<T, L>) {
        this._activatedRoute = inject(ActivatedRoute);
        this._confirmationService = inject(FuseConfirmationService);
        this._router = inject(Router);
        this._fuseMediaWatcherService = inject(FuseMediaWatcherService);
        this._service = _service;
    }

    ngOnInit(): void {
        this.watchRedirects();
        this.changePaginatorLabel();
        this.loadRecords();
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query => this._service.search(query)),
            )
            .subscribe();

        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.selectedRecord = null;
            }
        });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }
            });
    }

    loadRecords(): void {
        this.records$ = this._service.getItemsPaged(this.pageIndex + 1, this.pageSize);
    }

    onNavigationEnd(): void {
    }

    private changePaginatorLabel(): void {
        if (!this.paginator) {
            return;
        }
        this.paginator._intl.itemsPerPageLabel = "Itens por página";
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    create(): void {
        this._router.navigate(['./new'], {relativeTo: this._activatedRoute});
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    handlePageEvent(e: PageEvent): void {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.getData();
    }

    protected getData(): void {
        this.records$ = this._service.getItemsPaged(this.pageIndex + 1, this.pageSize);
    }

    search(query: string): void {
        this.records$ = this._service.search(query);
    }

    closeDrawer(): void {
        this._router.navigate(['.'], {relativeTo: this._activatedRoute});
        this.matDrawer.close();
    }

    /**
     * The main concept of this method is to close the dialog when the user comes to the root path
     * @private
     */
    private watchRedirects(): void {
        this._router.events.pipe(
            filter(event => event.type === EventType.NavigationEnd),
            map(event => event as NavigationEnd)
        ).subscribe((event) => {
            const isRootURL = event.url === `/${this._service.getRootPath()}`;
            if (this.matDrawer.opened && isRootURL) {
                this.onNavigationEnd();
                this.matDrawer.close();
            }
        });
    }
}
