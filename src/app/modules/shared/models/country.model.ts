import {BaseModel} from './base.model';
import {State} from './state.model';

export interface Country extends BaseModel {
    nome: string;
    states: State[];
}
