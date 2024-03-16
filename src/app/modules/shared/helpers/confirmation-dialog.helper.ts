import {FuseConfirmationConfig} from "../../../../@fuse/services/confirmation";

export class ConfirmationDialogHelper {
    static buildRemovalConfirmationDialog(): FuseConfirmationConfig {
        return {
            title: 'Remover registro',
            message: 'Você tem certeza que desja remover esse registro permanentemente? <span class="font-medium">Essa ação não pode ser desfeita!</span>',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Remover',
                    color: 'warn'
                },
                cancel: {
                    show: true,
                    label: 'Cancelar'
                }
            },
            dismissible: true
        };
    }
}
