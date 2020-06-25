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

  delete(not) {
    console.log('delete', not);

  }
}
