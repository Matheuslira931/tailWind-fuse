import { BaseModel } from "app/modules/shared/models/base.model";
import { Position } from "../roles/roles.types";

export interface Customer extends BaseModel {
    personId: number;
    person: Person;
    nome: string;
    rg: string;
    cpf: string;
    nacionalidade: string;
    profissao: string;
    documentoprofissional: string;
    sexo: string;
    naturalidade: string;
    estadocivilid: number;
    datanascimento: Date;
    primeiroacessoportal: boolean;
    senhaportal: string;
    porteinpiid: number;
    razaosocial: string;
    fantasia: string;
    cnpj: string;
    inscricaoestadual: string;
    customerCompany: CustomerCompany[];
}

export interface CustomerCompany extends BaseModel {
    clienteid?: number;
    empresaid?: number;
    cargoid?: number;
    position?: Position;
    customer?: Customer;
    company?: Company;
    descricao?: Company;
}

export interface CustomerCompanyV2 extends BaseModel {
    PersonBaseId?: number;
    PersonMemberId?: number;
    cargoid?: number;
    position?: Position;
    customer?: Customer;
    company?: Company;
    descricao?: Company;
}

export interface Company extends BaseModel {
    razaosocial: string;
    fantasia: string;
    personId: number;
    cnpj: string;
    inscricaoestadual: string;
}

export interface Person extends BaseModel {
    cidadeid: number;
    endereco: string;
    bairro: string;
    complemento: string;
    numero: string;
    cep: string;
    email: string;
    telefone: string;
    celular: string;
    celular2: string;
    status: number;
    tipo: PersonType;
    internacional: boolean;
    pre_cadastro: boolean;
    contacts: Contact[];
    team: CustomerCompanyV2[];
}

export interface PersonList {
    personId: number;
    descricao: string;
    documento: string;
    email: string;
    telefone: string;
    representante: string | null;
    tipo: number;
    tipoDesc: string;
}

export interface ContactType {
    id: number;
    contactGroup: number;
    description: string;
}

export enum PersonType {
    All = 0,
    Physical = 1,
    Juridical = 2,
    Correspondent = 3,
    Instituition = 4,
    Salesman = 5,
    User = 6,
    Atterney = 7,
    ExternalHolder = 8

}

export interface PersonCustomer {
    id: number;
    personId: number;
    person: Person;
    nome: string;
    rg: string;
    cpf: string;
    nacionalidade: string;
    profissao: string;
    documentoprofissional: string;
    sexo: string;
    naturalidade: string;
    estadocivilid: number;
    datanascimento: Date;
    primeiroacessoportal: boolean;
    senhaportal: string;
    porteinpiid: number;
    razaosocial: string;
    fantasia: string;
    cnpj: string;
    inscricaoestadual: string;
    team: CustomerCompany[];
}

// export interface Person extends BaseModel {
//     cidadeid: number;
//     endereco: string;
//     bairro: string;
//     complemento: string;
//     numero: string;
//     cep: string;
//     email: string;
//     telefone: string;
//     celular: string;
//     celular2: string;
//     status: number;
//     tipo: number;
//     internacional: boolean;
//     pre_cadastro: boolean;
//     customerCmpany: CustomerCompany[];
//     contacts: Contact[];
// }

export interface Contact extends BaseModel {
    contactType: ContactType;
    description: string;
    personId: number;
    contactTypeId: number;
}

export interface CustomerList {
    id: number;
    personId: number;
    descricao: string;
    documento: string;
    email: string;
    telefone: string;
    representante: any;
    tipo: number;
    tipoDesc: CustomerType;
}

export enum CustomerType {
    PF = 'PF',
    PJ = 'PJ'
}

export type CustomerSearchByType = 'PF' | 'PJ';

export enum CustomerFilterType {
    PF, PJ, ALL
}

export interface ContactData {
    emailsContactTypesId: Set<number>;
    phoneContactTypesId: Set<number>;
}

export interface CustomerCompanyPair {
    empresa: CustomerList;
    cargo: Position;
    clienteid: number;
}

export interface ContactPair {
    value: string;
    type: ContactType;
}
