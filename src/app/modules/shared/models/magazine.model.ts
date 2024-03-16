import {BaseModel} from './base.model';
import {MagazineDetail} from './magazine-detail.model';

export interface Magazine extends BaseModel {
    id: number;
    datarevista: Date;
    numerorevista: string;
    magazineDetail: MagazineDetail[];
}

export interface MagazineList extends BaseModel {
    id: number;
    datarevista: Date;
    numerorevista: string;
    magazineDetail?: MagazineDetail | undefined | null;
    attachment?: any | undefined | null;
}

