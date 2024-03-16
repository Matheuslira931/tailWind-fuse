import {BaseModel} from "./base.model";
import {Process} from "../../admin/process/process.types";

export interface MagazineDetail extends BaseModel {
    id: number;
    processoid: number;
    tipodespachoid: number;
    texto: string;
    datainclusao: Date;
    inicioprazoordinario: Date;
    fimprazoordinario: Date;
    inicioprazoextraordinario: Date;
    fimprazoextraordinario: Date;
    process: Process;
    tipoDespacho: any;
}
