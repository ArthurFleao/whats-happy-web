import { Injectable } from '@angular/core';
import { SnackService } from './snack.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private snack: SnackService,
  ) { }

  handle(error) {
    console.error(error);
    switch (error.code) {
      case 'auth/user-not-found':
        this.snack.warning('Email ou senha inválido!');
        break;
      case 'auth/invalid-email':
        this.snack.warning('Email inválido!');
        break;
      case 'auth/invalid-credential':
        this.snack.warning('Email ou senha inválido!');
        break;
      case 'auth/wrong-password':
        this.snack.warning('Email ou senha inválido!');
        break;
      case 'auth/invalid-password':
        this.snack.warning('Email ou senha inválido!');
        break;
      case 'auth/email-already-exists':
        this.snack.warning('Esse e-mail já foi cadastrado');
        break;
      case 'auth/email-already-in-use':
        this.snack.warning('Esse e-mail já foi cadastrado');
        break;
      case 'auth/user-disabled':
        this.snack.warning('Essa conta foi desabilitada! Se não esperava por isso, entre em contato com seu responsável.');
        break;

      default:
        this.snack.danger('Ocorreu um erro inesperado! Tente novamente.');
        break;
    }
  }
}
