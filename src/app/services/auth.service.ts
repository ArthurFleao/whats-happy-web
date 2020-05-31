import { DadosService } from './../service/dados.service';
import { Paciente } from './../model/paciente';
import { Psicologo } from './../model/psicologo';
import { DadosUsuario } from './../model/dadosUsuario';
import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Observer } from 'rxjs';
import { first, take } from 'rxjs/operators';


// redirecionamento de rotas
import { Router } from '@angular/router';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Obsevable para usuário
  user$: Observable<User>;

  constructor(
    private auth: AngularFireAuth,
    private db: DadosService,
    private router: Router
  ) {
    this.user$ = new Observable((observer) => {
      auth.authState.subscribe(userRes => {
        if (userRes?.uid) {
          this.db.getUserData(userRes.uid).subscribe((res: DadosUsuario) => {
            const nUser = {
              uid: userRes.uid,
              dadosUsuario: res
            };
            console.log('user changed', nUser);
            observer.next(nUser);
          }, error => {
            observer.error();
            console.error(error);
          });
        } else {
          observer.next(undefined);
        }
      }, error => {
        observer.error();
        console.error(error);
      });
    });
  }

  // criar usuario
  register(email, senha, dados?: DadosUsuario): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, senha);
  }

  // usuario logado
  me() {
    return this.auth.currentUser;
  }

  // realiza login no sistema
  public login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // sair do sistema
  logout() {
    this.auth.signOut();
  }

}
