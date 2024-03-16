import {BaseModel} from './base.model';
import {City} from './city.model';
import {Country} from './country.model';

export interface State extends BaseModel {
    nome: string;
    sigla: string;
    paisid: number;
    pais: Country;
    cities: City[];
}
