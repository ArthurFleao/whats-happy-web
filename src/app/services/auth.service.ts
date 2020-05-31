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
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = new Observable((observer) => {
      auth.authState.subscribe(userRes => {
        if (userRes?.uid) {
          this.getUserData(userRes.uid).subscribe((res: DadosUsuario) => {
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

  // armazenar os dados de usuario (endereco, cpf, telefone....)
  dadosUsuarioSave(id, dados: DadosUsuario) {
    return this.afs.collection('dadosUsuario').doc(id).set(dados);
  }

  // armazenar dados do psicologo (CRP)
  psicologoSave(id, objeto: Psicologo) {
    return this.afs.collection('psicologos').doc(id).set(objeto);
  }

  // armazenar dados do psicologo (CRP)
  pacienteSave(id, objeto: Paciente) {
    return this.afs.collection('pacientes').doc(id).set(objeto);
  }

  // realiza login no sistema
  public login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // sair do sistema
  logout() {
    this.auth.signOut();
  }

  // recupera dados do usuario, com base na id fornecida
  getUserData(uid) {
    // pesquisa da colection dadosUsuario, no documento com o nome da id do usuario
    return this.afs.collection('dadosUsuario').doc(uid).valueChanges();
  }

}
