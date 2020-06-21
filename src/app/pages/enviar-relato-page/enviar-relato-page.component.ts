import { AudioStorageService } from './../../services/audio-storage.service';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit, Sanitizer } from '@angular/core';
import { SnackService } from 'src/app/services/snack.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../services/auth.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-enviar-relato-page',
  templateUrl: './enviar-relato-page.component.html',
  styleUrls: ['./enviar-relato-page.component.scss']
})
export class EnviarRelatoPageComponent implements OnInit {

  myUid: string; // uid do usuário
  loading = false; // carregando?
  audioUrl: string;
  audio;
  uploadPercentage;
  form;
  relatoRequired: boolean;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private snack: SnackService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private audioStore: AudioStorageService,
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

  enviarRelato(values) {
    this.loading = true;
    // salva o relato na collection paciente => documento com a id do paciente que enviou o relato => subcollection relatos
    this.afs.collection('pacientes').doc(this.myUid).collection('relatos').add({

      grauFelicidade: values.grauFelicidade,
      grauDisposicao: values.grauDisposicao,
      grauIrritabilidade: values.grauIrritabilidade,
      relato: values.relato,
      dataHora: new Date().toISOString(),
      new: true,
      hasAudio: !!this.audio,

    }).then((finli) => {
      if (this.audio) {
        const task = this.audioStore.uploadAudio(this.myUid, finli.id, this.audio.blob);
        this.uploadPercentage = task.percentageChanges();
        task.then((result) => {
          this.loading = false; // indica que terminou de carregar
          // console.log('after upload', finli);
          this.afs.doc(finli.path).update({ audioUploaded: true }).then((result) => {
          }).catch((err) => {
            console.error(err);
          });
          this.snack.success('Relato enviado com sucesso!');
          this.router.navigate(['/home']);
        }).catch((err) => {
          this.eh.handle(err);
        });
      }
      else {
        this.loading = false; // indica que terminou de carregar
        this.snack.success('Relato enviado com sucesso!');
        this.router.navigate(['/home']);
      }

    }).catch((err) => {
      this.eh.handle(err);
    });
  }

  onAudioRecorded(audio) {
    let link: any = URL.createObjectURL(audio.blob);
    link = this.sanitizer.bypassSecurityTrustUrl(link);
    this.audioUrl = link;
    this.audio = audio;
    this.form.get('relato').clearValidators();
    this.form.get('relato').updateValueAndValidity();
    this.relatoRequired = false;
  }

}
