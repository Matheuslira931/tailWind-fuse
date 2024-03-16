import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {Magazine, MagazineList} from "../../models/magazine.model";

@Injectable({
    providedIn: 'root'
})
export class MagazinesService extends BaseService<MagazineList, Magazine> {

    constructor() {
        super('/magazines/');
    }

    getRootPath(): string {
        return null;
    }
}
