import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from "@angular/material/sort";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatRippleModule} from "@angular/material/core";
import {Collaborator} from "../../models/collaborator.model";

const MOCK_FILTER_OPTION = 'Limpar Filtros';

@Component({
    selector: 'app-list-selector',
    templateUrl: './list-selector.component.html',
    styles: [
        `
            .selector {
                width: 14rem;
                margin-left: 3rem;
            }
        `
    ],
    imports: [
        MatSortModule,
        MatPaginatorModule,
        NgClass,
        NgIf,
        NgForOf,
        RouterLink,
        MatIconModule,
        MatMenuModule,
        MatRippleModule
    ],
    standalone: true
})
export class ListSelectorComponent implements OnChanges {
    @Input() collaborators: Collaborator[] = [];
    @Output() chose = new EventEmitter<Collaborator>();
    @Output() clearFilter = new EventEmitter<void>();
    selected: Collaborator;

    ngOnChanges(changes: SimpleChanges): void {
        this.addMockCollaborator(changes);
    }

    onClickCollaborator(collaborator: Collaborator): void {
        const onClearFilter = collaborator.nome === MOCK_FILTER_OPTION;
        if (onClearFilter) {
            this.clearFilter.emit();
            this.selected = null;
            return;
        }
        this.chose.emit(collaborator);
        this.selected = collaborator;
    }

    private addMockCollaborator(changes: SimpleChanges): void {
        const collaboratorsChange = changes['collaborators'];
        if (collaboratorsChange) {
            const mockCollaborator: Partial<Collaborator> = {
                nome: MOCK_FILTER_OPTION
            };
            this.collaborators?.unshift(mockCollaborator as Collaborator);
        }
    }
}
