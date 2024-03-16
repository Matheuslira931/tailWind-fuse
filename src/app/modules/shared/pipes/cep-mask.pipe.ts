import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cepMask',
    standalone: true
})
export class CepMaskPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return '';
        }
        const numericValue = value.replace(/\D/g, '');
        return numericValue.replace(/^(\d{5})(\d{3})/, '$1-$2');
    }
}
