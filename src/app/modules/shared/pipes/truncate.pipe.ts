import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {


    transform(value: string, maxLength: number): string {
        if (!value) {
            return value;
        }
        return value?.length > maxLength ? value.substring(0, maxLength) + '...' : value;
    }

}
