import {Injectable} from '@angular/core';
import {Position} from './roles.types';
import {BaseService} from "../../shared/services/base.service";
import {POSITIONS_ROUTE} from "../../shared/constants/path-constants";
import {CARGOS} from "../../shared/constants/routes-constants";

@Injectable({providedIn: 'root'})
export class RolesService extends BaseService<Position, Position> {

    constructor() {
        super(POSITIONS_ROUTE);
    }

    getRootPath(): string {
        return CARGOS;
    }
}
