import { Observable, forkJoin, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DadosUsuario } from '../model/dadosUsuario';
import { Psicologo } from '../model/psicologo';
import { Paciente } from '../model/paciente';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  constructor(private afs: AngularFirestore) { }

  // recupera dados do usuario, com base na id fornecida
  getUserData(uid) {
    // pesquisa da colection dadosUsuario, no documento com o nome da id do usuario
    return this.afs.collection('dadosUsuario').doc(uid).valueChanges();
  }
  getPacienteData(uid) {
    return this.afs.collection('pacientes').doc(uid).valueChanges();
  }

  getPsicologoData(uid) {
    return this.afs.collection('psicologos').doc(uid).valueChanges();
  }

  // armazenar os dados de usuario (endereco, cpf, telefone....)
  dadosUsuarioSave(id, dados: DadosUsuario) {
    return this.afs.collection('dadosUsuario').doc(id).set(dados);
  }

  // armazenar dados do psicologo (CRP)
  psicologoSave(id, objeto: Psicologo) {
    return this.afs.collection('psicologos').doc(id).set(objeto);
  }

  pacienteSave(id, objeto: Paciente) {
    return this.afs.collection('pacientes').doc(id).set(objeto);
  }

  registerPaciente(dados: {uid: string, responsavelUid: string, dadosUsuario: any}) {
    const pac = this.afs.collection('pacientes').doc(dados.uid).set({
      responsavel: this.afs.collection('psicologos').doc(dados.responsavelUid).ref,
      dadosUsuario: dados.dadosUsuario
    });

    const data = this.afs.collection('dadosUsuario').doc(dados.uid).set(dados.dadosUsuario);

    const psi = this.afs.collection('psicologos/' + dados.responsavelUid + '/pacientes').doc(dados.uid).set({
      paciente: this.afs.collection('pacientes').doc(dados.uid).ref
    });

    return Promise.all([pac, data, psi]);

  }

  // superGet(doc) {
  //   const subs = [];
  //   this.findRefs(doc, subs);
  //   console.log('found refs', subs);
  //   return forkJoin(subs);
  // }

  // private findRefs(doc, subs?, loading?: Array<any>) {
  //     Object.values(doc).forEach((element: any) => {
  //       if (typeof (element) === 'object') {
  //         if (element.firestore) {
  //           this.afs.doc(doc).
  //         }
  //       }
  //     });
  // }
  // private findRefs(doc, subs?, loading?: Array<any>) {
  //   if (doc.firestore) { // se doc for uma referência
  //     if (!subs) {
  //       subs = [];
  //     }
  //     if (!loading) {
  //       loading = [];
  //     }
  //     loading.push(doc);
  //     // subs.push(this.afs.doc(doc).valueChanges().pipe(map(res => doc = res)));
  //     this.afs.doc(doc).valueChanges().subscribe(res => {
  //       doc = res;
  //       console.log('new value', res);
  //     });
  //     return subs;
  //   } else { // se doc for um objeto
  //     Object.values(doc).forEach((element: any) => {
  //       if (typeof (element) === 'object') {
  //         this.findRefs(element, subs);
  //       }
  //     });
  //   }
  // }

}
