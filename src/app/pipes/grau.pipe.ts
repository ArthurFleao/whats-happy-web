import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grau'
})
export class GrauPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    let r;
    switch (args[0]) {
      case 'i': r = this.switchIrritabilidade(value);
                break;
      case 'f': r = this.switchFelicidade(value);
                break;
      case 'd': r = this.switchDisposicao(value);
                break;

      default:
        r = null;
        break;
    }
    // console.log('r', r);

    return r;
  }

  switchIrritabilidade(value) {
    let r;
    switch (value) {
      case '0': r = 'Muito Facilmente Irritável';
                break;
      case '1': r = 'Facilmente Irritável';
                break;
      case '2': r = 'Irritável';
                break;
      case '3': r = 'Não Muito Irritável';
                break;
      case '4': r = 'De Bom Humor';
                break;
      case '5': r = 'De Muito Bom Humor';
                break;
      default:
        return null;
        break;
    }
    return r;
  }

  switchDisposicao(value) {
    let r;
    switch (value) {
      case '0': r = 'Muito Indisposto';
                break;
      case '1': r = 'Indisposto';
                break;
      case '2': r = 'Pouco Disposto';
                break;
      case '3': r = 'Disposto';
                break;
      case '4': r = 'Muito Disposto';
                break;
      case '5': r = 'Extremamente Disposto';
                break;
      default:
        return null;
        break;
    }
    return r;
  }

  switchFelicidade(value) {
    let r;
    switch (value) {
      case '0': r = 'Muito Triste';
                break;
      case '1': r = 'Triste';
                break;
      case '2': r = 'Pouco Triste';
                break;
      case '3': r = 'Apático';
                break;
      case '4': r = 'Um Pouco Feliz';
                break;
      case '5': r = 'Muito Feliz';
                break;
      default:
        return null;
        break;
    }
    return r;
  }
}
