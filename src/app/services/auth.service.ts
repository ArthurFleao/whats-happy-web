import { DadosService } from './dados.service';
import { Paciente } from './../model/paciente';
import { Psicologo } from './../model/psicologo';
import { DadosUsuario } from './../model/dadosUsuario';
import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Observer } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';


// redirecionamento de rotas
import { Router } from '@angular/router';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Obsevable para usuário
  user$: Observable<User>;
  private user = new User();

  constructor(
    private auth: AngularFireAuth,
    private fns: AngularFireFunctions,
    private db: DadosService,
    private router: Router
  ) {
    this.user$ = new Observable((observer) => {
      auth.authState.subscribe(userRes => {
        if (userRes?.uid) {
          this.user.uid = userRes.uid;
          // USER DATA SUBSCRIBE
          this.db.getUserData(userRes.uid).subscribe((res: DadosUsuario) => {
            this.user.dadosUsuario = res;
            // console.log('dadosUsuario changed', this.user);
            observer.next(this.user);
          }, error => {
            observer.error();
            console.error(error);
          });
          // USER DATA SUBSCRIBE

          // DADOS PSICOLOGO SUBSCRIBE
          this.db.getPsicologoData(userRes.uid).subscribe((res: Psicologo) => {
            this.user.dadosPsicologo = res;
            this.user.isPsicologo = !!res;
            // console.log('dadosPsicologo changed', this.user);
            observer.next(this.user);
          }, error => {
            observer.error();
            console.error(error);
          });
          // DADOS PSICOLOGO SUBSCRIBE

          // DADOS Paciente SUBSCRIBE
          this.db.getPacienteData(userRes.uid).subscribe((res: Paciente) => {
            this.user.dadosPaciente = res;
            this.user.isPaciente = !!res;
            // console.log('dadosPaciente changed', this.user);
            observer.next(this.user);
          }, error => {
            observer.error();
            console.error(error);
          });
          // DADOS Paciente SUBSCRIBE


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

  testRegister() {
    return this.fns.httpsCallable('register');
  }

}
