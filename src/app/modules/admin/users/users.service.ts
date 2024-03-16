import {Injectable} from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {User, UserList} from "./users.types";
import {USER_ROUTE} from "../../shared/constants/path-constants";
import {USUARIOS} from "../../shared/constants/routes-constants";

@Injectable({providedIn: 'root'})
export class UsersService extends BaseService<UserList, User> {

    constructor() {
        super(USER_ROUTE);
    }

    getRootPath(): string {
        return USUARIOS;
    }
}
