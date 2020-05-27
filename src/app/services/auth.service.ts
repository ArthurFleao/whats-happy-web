import { DadosUsuario, User } from './../model/dadosUsuario';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {Observable} from 'rxjs';

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

  // armazenar os dados de usuario (endereco, cpf, telefone....)
  dadosUsuarioSave(id, dados: DadosUsuario){
    return this.afs.collection('dadosUsuario').doc(id).set(dados);
  }

  // armazenar dados do psicologo (CRP)
  psicologoSave(id, objeto) {
    return this.afs.collection('psicologos').doc(id).set(objeto);
  }

  // realiza login no sistema
  public login(email: string, password: string) {
    this.auth
    .signInWithEmailAndPassword(email, password)
    .then(value => {
      console.log('deu certo');
      // redireciona para a pagina home do sistema
      this.router.navigate(['home']);
    })
    .catch(err => {
      console.log('Erro:', err.message);
    });
  }

  // sair do sistema
  logout() {
    this.auth.signOut();
  }


}
