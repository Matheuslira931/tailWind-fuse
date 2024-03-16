import {BaseModel} from "./base.model";
import {UF} from "./uf.model";

export interface City extends BaseModel {
    nome: string;
    codigo_ibge: number;
    estadoid: number;
    populacao_2010: number;
    densidade_demo: number;
    gentilico: string;
    area: number;
    estado: UF;
}
