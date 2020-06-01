import { Component, OnInit } from '@angular/core';
import { SnackService } from 'src/app/services/snack.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-enviar-relato-page',
  templateUrl: './enviar-relato-page.component.html',
  styleUrls: ['./enviar-relato-page.component.scss']
})
export class EnviarRelatoPageComponent implements OnInit {

  myUid: string; // uid do usuário

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private snack: SnackService
  ) {

    this.auth.me().then(res => { // recupera info do usuario
      this.myUid = res.uid; // salva uid do usuario logado
    }, error => {
      console.error(error);
    });

   }

  ngOnInit(): void {
  }

  enviarRelato(values){

    console.log("values", values)

    console.log("aqui")

    //salva o relato na collection paciente => documento com a id do paciente que enviou o relato => subcollection relatos
    this.afs.collection('paciente').doc(this.myUid).collection('relatos').add({

      grauFelicidade: values.grauFelicidade,
      grauDisposicao: values.grauDisposicao,
      grauIrritabilidade: values.grauIrritabilidade,
      relato: values.relato,
      dataHora: firebase.firestore.FieldValue.serverTimestamp()

    }).then((finli) => {
      //this.loading = false; // indica que terminou de carregar
      this.snack.success('Relato enviado com sucesso!');
    }).catch((err) => {
      console.error(err);
    });
  }

}
