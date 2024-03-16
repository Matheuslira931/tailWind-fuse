import {AsyncPipe, I18nPluralPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {RolesService} from "../roles.service";
import {Position} from "../roles.types";
import {HeaderListComponent} from "../../../shared/components/header-list/header-list.component";
import {BaseListComponent} from "../../../shared/components/base/base-list.component";
import {MatPaginatorModule} from "@angular/material/paginator";

@Component({
    selector: 'roles-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    styles: [`
        .paginator {
            position: absolute;
            bottom: 0;
        }
    `],
    imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, HeaderListComponent, MatPaginatorModule],
})
export class RolesListComponent extends BaseListComponent<Position, Position> implements OnInit, OnDestroy {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedRecord: Position;
    listTitle: string = 'Cargos';

    constructor(
        public _service: RolesService,
        public _router: Router,
    ) {
        super(_service);
    }
}
