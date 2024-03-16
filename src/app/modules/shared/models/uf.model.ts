import {BaseModel} from "./base.model";
import {Country} from "./country.model";

export interface UF extends BaseModel {
    nome: string;
    sigla: string;
    paisid: number;
    pais: Country;
}
