import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConvitesService {

  constructor(private afs: AngularFirestore) { }

  newConvite(myUid: string, nomeCompleto: string, email?: string) {
    const data = {
      psicologo: this.afs.collection('psicologos').doc(myUid).ref,
      nomeCompleto,
      email,
      expirado: false,
      cancelado: false,
    };

    return this.afs.collection('convites').add(data);
  }
}
