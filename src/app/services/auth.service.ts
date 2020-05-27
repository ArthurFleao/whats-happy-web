import { DadosUsuario, User } from './../model/dadosUsuario';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    ) { }

  register(email, senha, dados?: DadosUsuario): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, senha);
  }

  dadosUsuarioSave(id, dados: DadosUsuario){
    return this.afs.collection('dadosUsuario').doc(id).set(dados);
  }
}
