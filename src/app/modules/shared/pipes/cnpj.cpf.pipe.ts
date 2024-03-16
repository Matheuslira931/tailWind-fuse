import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cnpjorcpf',
    standalone: true
})
export class CnpjCpfPipe implements PipeTransform {

    transform(value: string): string {
        if (value.length === 11) {
            return value.replace(/[^0-9]/, '')
                .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4\-\$5');
    }

}
