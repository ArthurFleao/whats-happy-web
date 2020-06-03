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
      }, error => {
        this.eh.handle(error);
        observer.error();
      });
    });
    return convite$;
  }

}
