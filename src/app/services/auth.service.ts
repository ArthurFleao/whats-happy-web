import { Paciente } from './../model/paciente';
import { Psicologo } from './../model/psicologo';
import { DadosUsuario, User } from './../model/dadosUsuario';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { first, take } from 'rxjs/operators';


// redirecionamento de rotas
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Obsevable para usuário
  user: Observable<firebase.User>;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
    ) {

      this.user = auth.authState;

     }

  // criar usuario
  register(email, senha, dados?: DadosUsuario): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, senha);
  }

  me() {
    return this.auth.currentUser;
  }

  // armazenar os dados de usuario (endereco, cpf, telefone....)
  dadosUsuarioSave(id, dados: DadosUsuario){
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


}
