import {Injectable} from '@angular/core';
import {ProcessHistoryDetail} from './movement.model';
import {BaseService} from "../../shared/services/base.service";

@Injectable({
    providedIn: 'root'
})
export class MovementDetailService extends BaseService<ProcessHistoryDetail, ProcessHistoryDetail> {
    endpoint = 'movements';

    constructor() {
        super('movements');
    }
}
