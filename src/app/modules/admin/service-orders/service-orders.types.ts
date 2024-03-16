import { Customer } from "../customers/customers.types";

export interface ServiceOrderList {
    dataCriacao: Date;
    id: number;
    numeroPedido: number;
    prazoautorizacao: Date;
    prioridade: Date;
    situacao: string;
    titular: string;
    valor: number;
}

export interface Account {
    id: number;
    clienteid: number;
    empresaid: number;
    valor: number;
    desconto: number;
    vendedorid: number;
    convenioid: number;
    status: number;
    numeroparcelas: number;
    valorpermuta: number;
    pessoa_vendedor_id: number;
    accountInstallment: AccountInstallment[]
}

export interface AccountInstallment {
    id: number;
    contaid: number;
    valor: number;
    numeroparcela: number;
    status: number;
    formapagamentoid: number;
    datavencimento: number;
}

export interface ServiceOrderHolder {
    customerId: number;
    companyId: number;
    customer: Customer;
    company: Company;
}

export interface Service {
    fullDescription: string;
    petitionName: string;
    term: string;
    value: string;
}

export interface Company {
    id: number;
    personId: number;
    person: any;
    porteinpiid: number;
    razaosocial: string;
    fantasia: string;
    cnpj: string;
    inscricaoestadual: string;
    customerCompany: [];
}
