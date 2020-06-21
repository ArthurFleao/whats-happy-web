import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sexo'
})
export class SexoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let r;
    switch (value) {
      case 'm':
        r = 'Masculino';
        break;
      case 'f':
        r = 'Feminino';
        break;
      case 'outro':
        r = 'Outro';
        break;
      case 'no':
        r = 'Não especificado';
        break;
      default:
        r = 'Não especificado';
        break;
    }
    return r;
  }

}
