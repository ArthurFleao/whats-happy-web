import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { SnackService } from 'src/app/services/snack.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../services/auth.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enviar-relato-page',
  templateUrl: './enviar-relato-page.component.html',
  styleUrls: ['./enviar-relato-page.component.scss']
})
export class EnviarRelatoPageComponent implements OnInit {

  myUid: string; // uid do usuário
  loading = false; // carregando?

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private snack: SnackService,
    private router: Router,
    private eh: ErrorHandlerService,
  ) {

    this.auth.me().then(res => { // recupera info do usuario
      this.myUid = res.uid; // salva uid do usuario logado
    }, error => {
      this.eh.handle(error);
    });

   }

  ngOnInit(): void {
  }

  enviarRelato(values){
    this.loading = true;
    // salva o relato na collection paciente => documento com a id do paciente que enviou o relato => subcollection relatos
    this.afs.collection('pacientes').doc(this.myUid).collection('relatos').add({

      grauFelicidade: values.grauFelicidade,
      grauDisposicao: values.grauDisposicao,
      grauIrritabilidade: values.grauIrritabilidade,
      relato: values.relato,
      dataHora: firebase.firestore.FieldValue.serverTimestamp()

    }).then((finli) => {
      this.loading = false; // indica que terminou de carregar
      this.snack.success('Relato enviado com sucesso!');
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.error(err);
    });
  }

}
