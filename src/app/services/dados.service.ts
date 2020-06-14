import { Observable, forkJoin, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DadosUsuario } from '../model/dadosUsuario';
import { Psicologo } from '../model/psicologo';
import { Paciente } from '../model/paciente';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

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

  // retorna a lista de pacientes do psicólogo logado
  getListaPacientes(uid) {
    return this.afs.collection('psicologos').doc(uid).collection('pacientes').valueChanges();
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

  listRelatos(idPaciente) {
    return this.afs.collection(`pacientes/${idPaciente}/relatos/`).valueChanges({ idField: 'uid' }).pipe(map((res: any) => {


      res.sort((a: any, b: any) => {
        if (moment(a.dataHora).isAfter(moment(b.dataHora))) {
          return -1;
        } else {
          return 1;
        }
      });

      let audioTranscrito;
      let noResults = true;
      res.forEach((relato: any) => {
        relato.dataHora = moment(relato.dataHora);
        relato.pacienteUid = idPaciente;

        if (relato.transcription && relato.transcription != null) {
          relato.transcription.forEach(transcript => {
            if (transcript && transcript != null) {
              if (transcript.results?.length > 0) {
                transcript.results?.forEach(result => {
                  result?.alternatives?.forEach(alternative => {
                    if (alternative != null) {
                      console.log('transcript', alternative.transcript);
                      audioTranscrito = alternative.transcript;
                      noResults = false;

                    }
                  });
                });
              }
            }
          });
        }
        relato.audioTranscrito = audioTranscrito;
        relato.noResults = noResults;
      });


      return res;
    }));
  }

  markRelatoAsSeen(pacienteUid, relatoUid) {
    this.afs.collection('pacientes/' + pacienteUid + '/relatos').doc(relatoUid).update({
      new: false
    }).then((result) => {
      console.log('relato visto', relatoUid);
    }).catch((err) => {
      console.error(err);
    });
  }


  registerPaciente(dados: { uid: string, responsavelUid: string, dadosUsuario: any }) {
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


  disablePaciente(uid) {
    return this.afs.collection('pacientes').doc(uid).update({
      disabled: true
    });
  }

  disablePsicologo(uid) {
    return this.afs.collection('psicologos').doc(uid).update({
      disabled: true
    });
  }

  enablePsicologo(uid) {
    return this.afs.collection('psicologos').doc(uid).update({
      disabled: false
    });
  }

  enablePaciente(uid) {
    return this.afs.collection('pacientes').doc(uid).update({
      disabled: false
    });
  }

  getProntuario(uid) {

    return this.afs.collection('pacientes').doc(uid).collection('fichasConsultas').get();

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
