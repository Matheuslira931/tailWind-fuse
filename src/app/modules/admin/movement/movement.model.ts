import { BaseModel } from "app/modules/shared/models/base.model";

export interface ProcessHistory extends BaseModel {
    createdAt: Date;
    date: Date;
    description: string;
    dispatchComplement: string;
    extraordinaryTerm: null
    id: number;
    imageUrl: string;
    movement: string;
    ordinaryTerm: string;
    processNumber: number;
    protocolNumber: string;
    rpi: string;
    serviceOrderAuthDate: Date;
    serviceOrderCreatedAt: Date;
    serviceOrderNumber: string;
    type: number;
}

export interface ProcessHistoryDetail extends BaseModel {
    processId: number;
    newMagazineNumber: number;
    title: string;
    freeText: string;
    magazineDate: Date;
    magazineId: number;
    magazineNumber: string;
    movementId: number;
    protocolDate: Date;
    protocolNumber: number;
    type: 1 | 2 | 3;
    processNumber: number;
    attachment: string[];
}

export interface MovementList extends BaseModel {
    nome: string;
    nomeInpi: string;
    tipo: number;
    codigo: string;
}
