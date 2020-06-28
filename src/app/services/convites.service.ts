import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvitesService {

  constructor(private afs: AngularFirestore,
              private eh: ErrorHandlerService,
  ) { }

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

  getConvite(id) {
    const convite$ = new Observable(observer => {
      this.afs.collection('convites').doc(id).valueChanges().subscribe((cv: any) => {
        console.log('cv:', cv);

        if (cv) {
          this.afs.doc(cv.psicologo).valueChanges().subscribe(psi => {
            const convite = cv;
            const psiUid = this.afs.doc(cv.psicologo).ref.id;
            cv.psicologo = psi;
            cv.psicologo.uid = psiUid;
            observer.next(convite);
            observer.complete();
          }, error => {
            this.eh.handle(error);
            observer.error();
          });
        } else {
          observer.next(undefined);
          observer.complete();
        }
      }, error => {
        this.eh.handle(error);
        observer.error();
      });
    });
    return convite$;
  }

  useConvite(id) {
    this.afs.collection('convites').doc(id).update({
      used: true
    }).then((result) => {

    }).catch((err) => {
      this.eh.handle(err);
    });
  }

  setCanceladoTo(id, state: boolean) {
    return this.afs.collection('convites').doc(id).update({cancelado: state});
  }

  delete(id) {
    return this.afs.collection('convites').doc(id).delete();
  }

  listarConvites(uid){

    // pegar a referencia da coleção psicologo
    const psicologoRef = this.afs
      .collection('psicologos')
      .doc(uid);

    return this.afs.collection('convites', ref => ref.where('psicologo', '==', psicologoRef.ref)).valueChanges({idField: 'uid'});
  }

}
