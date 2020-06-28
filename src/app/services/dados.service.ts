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
  dadosUsuarioUpdate(id, dados: any) {
    return this.afs.collection('dadosUsuario').doc(id).update(dados);
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

      res.forEach((relato: any) => {
        // let audioTranscrito = '';
        // let noResults = true;
        if (relato.analiseRelato) {
          relato.relatoAlertaScore = this.calcularNivelAlerta(relato.analiseRelato, relato.relato);
        }

        if (relato.analiseAudioTranscrito) {
          relato.audioAlertaScore = this.calcularNivelAlerta(relato.analiseAudioTranscrito, relato.audioTranscrito);
        }

        relato.dataHora = moment(relato.dataHora);
        relato.pacienteUid = idPaciente;
      });

      return res;
    }));
  }

  private calcularNivelAlerta(analise: any, texto?: string) {
    let score = 0;
    analise.forEach((document: any) => {
      if (document && document !== null) {
        // SENTIMENT
        const docScore = document.documentSentiment.score;
        const docMag = document.documentSentiment.magnitude;
        if (docScore < 0.25) {
          score += (Math.abs(docScore) * docMag) * 150; // quanto mais negativo for o relato, mais alerta score
        }
        // END SENTIMENT
        console.log('sentiment score', score);

        // TOKENS
        document.tokens.forEach(token => {
          switch (token.lemma) {
            case 'suicídio':
              score += 65;
              break;
            case 'suicidar':
              score += 70;
              break;
            case 'suicída':
              score += 70;
              break;
            case 'assassinato':
              score += 50;
              break;
            case 'assassinar':
              score += 65;
              break;
            case 'matar':
              score += 65;
              break;
            case 'cortar':
              score += 30;
              break;
            case 'machucar':
              score += 30;
              break;
            case 'agredir':
              score += 30;
              break;
            case 'prédio':
              score += 40;
              break;
            case 'ponte':
              score += 40;
              break;
            case 'carro':
              score += 30;
              break;
            case 'arma':
              score += 50;
              break;
            case 'tiro':
              score += 50;
              break;
            case 'atirar':
              score += 50;
              break;
            case 'cabeça':
              score += 30;
              break;
            case 'peito':
              score += 30;
              break;
            case 'remédio':
              score += 30;
              break;
            case 'overdose':
              score += 60;
              break;
            case 'quero':
              score += 30;
              break;
            case 'pretendo':
              score += 30;
              break;
            case 'preciso':
              score += 30;
              break;
            case 'vou':
              score += 30;
              break;
            case 'acabar':
              score += 20;
              break;
            case 'acabou':
              score += 20;
              break;
            case 'me':
              score += 15;
              break;
            case 'morto':
              score += 45;
              break;
            case 'morrendo':
              score += 45;
              break;
            case 'sangue':
              score += 50;
              break;
            case 'sangrando':
              score += 50;
              break;
            case 'ensanguentado':
              score += 50;
              break;
            case 'faca':
              score += 50;
              break;
            case 'pescoço':
              score += 50;
              break;
            case 'pulso':
              score += 50;
              break;
            case 'pulsos':
              score += 50;
              break;

            default:
              break;
          }
        });
        // END TOKENS
      }

    });

    if (texto) {
      if (texto.includes('eu pretendo me matar') ) {
        score += 100;
      }
      if (texto.includes('eu quero me matar') ) {
        score += 100;
      }
      if (texto.includes('eu vou me matar') ) {
        score += 100;
      }
      if (texto.includes('eu pretendo me suicidar') ) {
        score += 100;
      }
      if (texto.includes('eu quero me suicidar') ) {
        score += 100;
      }
      if (texto.includes('eu vou me suicidar') ) {
        score += 100;
      }
      if (texto.includes('vou me') ) {
        score += 15;
      }
      if (texto.includes('quero me') ) {
        score += 15;
      }
      if (texto.includes('me matar') ) {
        score += 75;
      }
      if (texto.includes('me suicidar') ) {
        score += 75;
      }
      if (texto.includes('acabar com') ) {
        score += 45;
      }
      if (texto.includes('acabar com a vida') ) {
        score += 85;
      }
      if (texto.includes('acabar com a minha vida') ) {
        score += 85;
      }
      if (texto.includes('não aguento') ) {
        score += 40;
      }
      if (texto.includes('pular d') ) {
        score += 40;
      }
      if (texto.includes('jogar d') ) {
        score += 40;
      }
      if (texto.includes('pular n') ) {
        score += 40;
      }
      if (texto.includes('jogar n') ) {
        score += 40;
      }
      if (texto.includes('atirar d') ) {
        score += 40;
      }
      if (texto.includes('atirar n') ) {
        score += 60;
      }
    }

    return score;
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

    const notification = {
      message: 'aceitou seu convite e agora é seu paciente!',
      type: 'convite-aceito',
      pacienteUID: dados.uid,
      data: new Date().toISOString(),
      responsavelUID: dados.responsavelUid,
    };

    this.afs.collection('notificacoes/' + dados.responsavelUid + '/notificacoes').doc(dados.uid).set(notification).then((result) => {
      // console.log('notificação salva no bd');
    }).catch((err) => {
      console.error(err);
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




  /////////////////////////////// ATUALIZAR PSICOLOGO RESPONSAVEL //////////////////////////////////////
  updateResponsavel(pacienteId, psicologoResponsavelId) {

    // pegar a referencia da coleção psicologo
    const psicologoResponsavelRef = this.afs
      .collection('psicologos')
      .doc(psicologoResponsavelId);

    console.log('updateResponsavel Ref', psicologoResponsavelRef.ref);

    this.afs.collection('pacientes').doc(pacienteId).update({
      responsavel: psicologoResponsavelRef.ref
    });

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
