import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cpf',
  standalone: true
})
export class CpfPipe implements PipeTransform {

  transform(value: string | number): string {
    if (value) {
      return value.toString()
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return '';
  }

}
