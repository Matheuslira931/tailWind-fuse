import {BaseModel} from "./base.model";

export interface Collaborator extends BaseModel {
    personId: number;
    pfPj: number;
    tipo: string;
    nome: string;
    cpfCnpj: string;
}
