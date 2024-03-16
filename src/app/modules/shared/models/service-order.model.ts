import {BaseModel} from "./base.model";

export interface ServiceOrder extends BaseModel {
    id: number;
    numeropedido: string;
    situacao: number;
    clienteid: number;
    valorpedido: number;
    observacao: string;
    valordesconto: number;
    empresaid: number;
    geradoautomatico: true;
    tipopedido: number;
    datahora: Date;
    vendedorid: number;
    convenioid: number;
    contaid: number;
    valorpermuta: number;
    gerarnfe: true;
    prazoautorizacao: Date;
    prioridade: 1;
    despachoid: number;
    calcularprazoservicos: true;
    dataautorizacao: Date;
    pessoa_vendedor_id: number;
    valorliquido: number;
    priority: string;
    status: string;
}
