import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from "@angular/material/sort";
import {ListConfig} from "./list.types";
import {Page} from "../../models/page.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    imports: [
        MatSortModule,
        MatPaginatorModule,
        NgClass,
        NgIf,
        NgForOf,
        RouterLink
    ],
    standalone: true
})
export class ListComponent implements OnInit {
    @Input() listConfig!: ListConfig[];
    @Input() fieldsToShow!: string[];
    @Input() page!: Page<any>;
    @Input() isLoading!: boolean;
    @Input() showPaginator: boolean = true;
    @Input() pageIndex!: number;
    @Input() pageSize!: number;
    @Input() length!: number;
    @Output() pageSizeChange = new EventEmitter<PageEvent>();
    @Output() pageSortChanged = new EventEmitter<Sort>();
    gridStyle!: string;
    protected readonly pageSizeOptions = [50, 100, 200];

    ngOnInit(): void {
        this.gridStyle = `grid-cols-${this.listConfig.length}`;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    handlePageEvent(event: PageEvent): void {
        this.pageSizeChange.emit(event);
    }

    onChangeSort(sort: Sort): void {
        this.pageSortChanged.emit(sort);
    }
}
