import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgFor, NgIf} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {Item, Items} from "../file-manager.types";
import {Subject, takeUntil} from "rxjs";
import {FileManagerService} from "../file-manager.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {FileManagerDetailsComponent} from "../details/details.component";

@Component({
    selector: 'app-attachment-list',
    templateUrl: './list.component.html',
    imports: [MatSidenavModule, RouterOutlet, NgIf, RouterLink, NgFor, MatButtonModule, MatIconModule, MatTooltipModule, MatCheckboxModule, FormsModule, FileManagerDetailsComponent],
    standalone: true
})
export class FileManagerListComponent implements OnInit, OnDestroy {
    @Input() showFolders = true;
    @Output() selected = new EventEmitter<Item>();
    selectedItem: Item = {
        id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
        folderId: null,
        name: 'Personal',
        createdBy: 'Brian Hughes',
        createdAt: 'April 24, 2018',
        modifiedAt: 'April 24, 2018',
        size: '87 MB',
        type: 'folder',
        contents: '57 files',
        description: 'Personal documents such as insurance policies, tax papers and etc.',
    };
    events: string[] = [];
    items: Items = {
        files: [],
        path: [],
        folders: []
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    openedSideNav = false;

    constructor(private _fileManagerService: FileManagerService) {
    }

    ngOnInit(): void {
        this._fileManagerService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Items) => {
                this.items = items ?? {
                    files: [
                        {
                            id: '5cb66e32-d1ac-4b9a-8c34-5991ce25add2',
                            folderId: null,
                            name: 'Contract #123',
                            createdBy: 'Brian Hughes',
                            createdAt: 'January 14, 2021',
                            modifiedAt: 'January 14, 2021',
                            size: '1.2 MB',
                            type: 'PDF',
                            contents: null,
                            description: null,
                        }
                    ],
                    path: [],
                    folders: [
                        {
                            id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
                            folderId: null,
                            name: 'Personal',
                            createdBy: 'Brian Hughes',
                            createdAt: 'April 24, 2018',
                            modifiedAt: 'April 24, 2018',
                            size: '87 MB',
                            type: 'folder',
                            contents: '57 files',
                            description: 'Personal documents such as insurance policies, tax papers and etc.',
                        }
                    ]
                };
            });

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openSideNav(file: Item): void {
        this.selected.emit(file);
    }
}
