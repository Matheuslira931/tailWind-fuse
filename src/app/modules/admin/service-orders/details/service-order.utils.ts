import {CardOptions} from "../../../shared/components/card-options/card-options.types";
import {Injectable} from "@angular/core";
import {AttachmentFormComponent} from "../forms/attachment/attachment-form.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({providedIn: 'root'})
export class ServiceOrderUtils {

    constructor(private _matDialog: MatDialog) {
    }

    getIdentificationOptions(): CardOptions[] {
        return [
            {
                label: 'Editar Prazo de Autorização',
                onClick: () => {
                    this._matDialog.open(AttachmentFormComponent, {
                        width: '400px',
                        id: 'no-padding-dialog'
                    });
                }
            },
            {
                label: 'Editar Colaborador',
                onClick: () => {
                }
            }
        ];
    }

    getContractorOptions(): CardOptions[] {
        return [
            {
                label: 'Editar Contratante',
                onClick: () => {
                }
            },
        ];
    }

    getServiceOptions(): CardOptions[] {
        return [
            {
                label: 'Marca',
                onClick: () => {
                }
            },
            {
                label: 'Petição',
                onClick: () => {
                }
            },
            {
                label: 'Outro',
                onClick: () => {
                }
            },
        ];
    }

    getFinancialDataOptions(): CardOptions[] {
        return [
            {
                label: 'Editar Desconto',
                onClick: () => {
                }
            },
            {
                label: 'Editar Permuta',
                onClick: () => {
                }
            },
        ];
    }

    getFormOhPaymentOptions(): CardOptions[] {
        return [
            {
                label: 'Á Vista',
                onClick: () => {
                }
            },
            {
                label: '2 Parcelas',
                onClick: () => {
                }
            },
            {
                label: '3 Parcelas',
                onClick: () => {
                }
            },
            {
                label: '4 Parcelas',
                onClick: () => {
                }
            },
            {
                label: '5 Parcelas',
                onClick: () => {
                }
            },
            {
                label: '6 Parcelas',
                onClick: () => {
                }
            },
        ];
    }
}
