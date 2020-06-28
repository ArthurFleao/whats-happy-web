import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {

  constructor(private afs: AngularFirestore, private auth: AuthService) { }

  list(userId) {
    return this.afs.collection('notificacoes/' + userId + '/notificacoes').valueChanges({ idField: 'uid' });
  }

  marcarComoLida(userId, notificacaoId) {
    return this.afs.collection('notificacoes/' + userId + '/notificacoes').doc(notificacaoId).update({ lida: true }).then((result) => {
      console.log('notificacao lida', notificacaoId);
    }).catch((err) => {
      console.error(err);
    });

  }

  delete(userId, notificacaoId) {
    return this.afs.collection('notificacoes/' + userId + '/notificacoes').doc(notificacaoId).delete();
  }
}
