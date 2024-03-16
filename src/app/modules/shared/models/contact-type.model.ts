import {BaseModel} from "./base.model";

export interface ContactType extends BaseModel {
    description: string;
    contactGroup: number;
}
