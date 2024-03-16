import {BaseModel} from "app/modules/shared/models/base.model";
import {Customer} from "../customers/customers.types";

export interface ProcessList {
    id: number;
    numeroProcesso: string;
    elementoNominativo: any;
    tipo: any;
    prioridade: any;
    ncl: any;
    titular: string;
    situacao: string;
    apresentacao: string;
    urlLogo: string;
}

export interface Process {
    id: number;
    numeroprocesso: string;
    pedidoId: number;
    situacaoregistroid: number;
    externo: boolean;
    prioridade: any;
    publicationForecast: any;
    defermentForecast: any;
    processHolder: ProcessHolder[];
    brandingProcess: BrandingProcess[];
    processPetition: ProcessPosition[];
    collaborators: [];
    situacaoRegistro: RegistrySituation;
    details: ProcessDetails;
}

export interface Company {
    id: number;
    personId: number;
    person: null;
    porteinpiid: number;
    razaosocial: string;
    fantasia: string;
    cnpj: string;
    inscricaoestadual: string;
    customerCompany: []
}

export interface Class {
    id: number;
    numero: number;
    tipo: number;
    classItem: null;
}

export interface BrandingProcess {
    id: number;
    classeid: number;
    elementonominativo: string;
    tipo: number;
    logosituacao: number;
    logomarca: string;
    apresentacao: string;
    urlLogo: string;
    class: Class;
    brandingProcessClassesItem: BrandingProcessClassItem[]
}

export interface BrandingProcessClassItem {
    id: number;
    processomarcaid: number;
    classeitemid: number;
    textolivre: string;
    "classItem": ClassItem;
}

export interface ClassItem {
    classe: string;
    nome: string;
    numerobase: string;
    classeid: number;
    class: any;
    id: number;
}

export interface ProcessHolder {
    id: number;
    personId: number;
    customerId: number;
    companyId: number;
    externalPersonId: number;
    processId: number;
    customer: Customer;
    company: Company;
    externalPerson: any;
    person: any
}

export interface ProcessPosition {
    id: number;
    processoid: number;
    tipodespachoid: number;
    pedidoid: number;
    numeroprotocolo: null;
    dataprotocolo: null;
    texto: string;
    prazoordinario: number;
    prazoextraordinario: number;
    custo: number;
    situacaopeticaoid: number;
    status: number;
    nossonumero: any;
    datacriacao: Date;
    numeroprocesso: any;
    dataprazoordinario: Date;
    dataprazoextraordinario: Date;
    despachodetalheid: number;
}

export interface RegistrySituation {
    id: number;
    nome: string;
    descricao: string;
    grupo: number;
}

export interface ProcessDetails {
    validity: string;
    ordinaryTerm: string;
    extraordinaryTerm: string;
    validityPercentage: number;
    extensionPercentage: number;
    extensionName: string;
    progressPercentage: number;
    publicationForecast: any;
    publicationDispatch: string;
    defermentForecast: any;
    defermentDispatch: string;
    "forecastName": string;

}

export interface BrandingProcessDetails extends BaseModel {
    validity: string;
    ordinaryTerm: string;
    extraordinaryTerm: string;
    validityPercentage: number;
    extensionPercentage: number;
    extensionName: string;
    defermentDispatch: null;
    defermentForecast: null;
    flowPercentage: number;
    publicationDispatch: Date;
    publicationForecast: Date;
    ordinaryTermStartDate: Date;
    ordinaryTermEndDate: Date;
    extraordinaryTermStartDate: Date;
    extraordinaryTermEndDate: Date;
}

export interface BrandingProcessHistory extends BaseModel {
    id: number;
    processNumber: string;
    imageUrl: string;
    type: number;
    createdAt: Date;
    /**
     * This field corresponds to the title of the entity
     */
    movement: string;
    protocolNumber: string;
    rpi: string;
    ordinaryTerm: string;
    extraordinaryTerm: string;
    serviceOrderNumber: string;
    serviceOrderAuthDate: string;
    serviceOrderCreatedAt: Date;
    date: Date;
    description: string;
    dispatchComplement: string;
}

export interface BrandingProcessMovement extends BaseModel {
    createdAt: Date;
    date: Date;
    description: string;
    dispatchComplement: string;
    extraordinaryTerm: string;
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
