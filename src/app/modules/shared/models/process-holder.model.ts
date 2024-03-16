import {BaseModel} from "./base.model";

export interface ProcessHolder extends BaseModel {
    id: number;
    personId: number;
    customerId: number;
    companyId: number;
    processId: number;
}
