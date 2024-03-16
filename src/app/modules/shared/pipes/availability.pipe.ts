import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'availability',
    standalone: true
})
export class AvailabilityPipe implements PipeTransform {

    transform(value: boolean): string {
        return !!value ? 'Ativo' : 'Inativo';
    }

}
