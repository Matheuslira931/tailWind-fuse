import {AsyncPipe, I18nPluralPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, RouterOutlet} from '@angular/router';
import {UsersService} from "../users.service";
import {User, UserList} from "../users.types";
import {BaseListComponent} from "../../../shared/components/base/base-list.component";
import {HeaderListComponent} from "../../../shared/components/header-list/header-list.component";
import {MatPaginatorModule} from "@angular/material/paginator";

@Component({
    selector: 'users-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .paginator {
            position: absolute;
            bottom: 0;
        }
    `],
    standalone: true,
    imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, HeaderListComponent, MatPaginatorModule],
})
export class UsersListComponent extends BaseListComponent<UserList, User> implements OnInit, OnDestroy {

    listTitle: string = 'Usuários';

    constructor(
        public _service: UsersService,
    ) {
        super(_service);
    }
}
