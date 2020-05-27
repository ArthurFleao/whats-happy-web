import { FormGroup, FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): {[key: string]: any} {
    const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return {invalidEmail: true};
    }
}

export function dateValidator(control: FormControl): {[key: string]: any} {
    // tslint:disable-next-line:max-line-length
    const dateRegexp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (control.value && !dateRegexp.test(control.value)) {
        return {invalidData: true};
    }
}

export function siteValidator(control: FormControl): {[key: string]: any} {
    const siteRegexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    if (control.value && !siteRegexp.test(control.value)) {
        return {invalidWebSite: true};
    }
}

export function cnpjValidator(control: FormControl): {[key: string]: any} {
  if (control.value) { return; }
  const cnpj = control.value.replace(/[^\d]+/g, '');
  if (cnpj === '') { return {invalidCnpj: true}; }
  if (cnpj.length !== 14) {
      return {invalidCnpj: true};
  }
  // Elimina CNPJs invalidos conhecidos
  if (cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999') {
      return {invalidCnpj: true};
  }

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
          pos = 9;
      }
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== Number(digitos.charAt(0))) {
      return {invalidCnpj: true};
  }

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
          pos = 9;
      }
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== Number(digitos.charAt(1))) {
      return {invalidCnpj: true};
  }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const passwordConfirmation = group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true});
        }
    };
}
