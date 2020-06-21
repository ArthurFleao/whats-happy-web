import { takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { AudioStorageService } from './../../services/audio-storage.service';
import { Relato } from './../../model/relato';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-relato-card',
  templateUrl: './relato-card.component.html',
  styleUrls: ['./relato-card.component.scss']
})
export class RelatoCardComponent implements OnInit, OnDestroy {
  @Input() relato: Relato;
  audioUrl;
  sentimentoRelato;
  sentimentoAudio;
  panelOpen;
  audioIsFucked;

  @Output()
  relatoOpened = new EventEmitter<any>();
  audioIsUploading: boolean;
  private onDestroy$ = new EventEmitter();
  palavrasAudio: any[];
  palavrasRelato: any[];
  analisandoRelato: boolean;
  analisandoAudio: boolean;

  constructor(
    private audioStore: AudioStorageService,
    private eh: ErrorHandlerService,
    private afs: AngularFirestore,
  ) { }

  getComplete(time) {
    return moment(time).format('DD/MM/YYYY HH:mm');
  }
  getFromNow(time) {
    return moment(time).fromNow();
  }
  ngOnInit(): void {
    this.checkAudio();
    this.atualizaSentiments();
    this.afs.collection('pacientes/' + this.relato.pacienteUid + '/relatos').doc(this.relato.uid).valueChanges()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res: Relato) => {
        const updateRelato: Relato = res;
        updateRelato.pacienteUid = this.relato.pacienteUid;
        updateRelato.uid = this.relato.uid;
        updateRelato.dataHora = this.relato.dataHora;
        this.relato = updateRelato;
        this.checkAudio();
        this.atualizaSentiments();
      }, error => {
        console.error(error);
      });
  }

  checkAudio() {
    if (this.relato.hasAudio) {
      if (this.relato.audioUploaded) {
        this.audioIsUploading = false;
        this.audioStore.getRelatoAudio(this.relato.pacienteUid, this.relato.uid).subscribe(res => {
          this.audioUrl = res;
        }, error => {
          this.audioIsFucked = true;
        });
      } else {
        this.audioIsUploading = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  opened() {
    if (this.relato.new) {
      this.relato.new = false;
      this.relatoOpened.emit(this.relato);
    }
  }

  atualizaSentiments() {
    if (this.relato.analiseAudioTranscrito) {
      this.analisandoAudio = false;
      const analise = this.relato.analiseAudioTranscrito[0];
      const score = analise.documentSentiment.score;
      const magnitude = analise.documentSentiment.magnitude;
      this.sentimentoAudio = this.classificaSentiment(score, magnitude);
      this.palavrasAudio = this.getPalavrasImportantes(analise.entities);
    } else {
      this.analisandoAudio = true;
    }

    if (this.relato.analiseRelato) {
      this.analisandoRelato = false;
      const analise = this.relato.analiseRelato[0];
      const score = analise.documentSentiment.score;
      const magnitude = analise.documentSentiment.magnitude;
      this.sentimentoRelato = this.classificaSentiment(score, magnitude);
      this.palavrasRelato = this.getPalavrasImportantes(analise.entities);
    } else {
      this.analisandoRelato = true;
    }
  }

  classificaSentiment(score: number, magnitude: number) {
    let str = '';
    const magnitudeAbsoluta = Math.abs(magnitude);
    if (magnitudeAbsoluta > 2) {
      str += 'Claramente ';
    } else {
      str += 'Provavelmente ';
    }

    if (score > 0.25) {
      str += 'Positivo';
    } else if (score < 0.25) {
      str += 'Negativo';
    } else {
      str += 'Neutro';
    }

    if (magnitude > 2.5 && Math.abs(score) < 0.25) {
      str = 'Misto';
    }
    return str;
  }

  getPalavrasImportantes(entities) {
    const palavrasList = [];
    entities?.forEach(entity => {
      if (palavrasList.length < 10) {
        if (!palavrasList.includes(entity.name)) {
          palavrasList.push(entity.name);
        }
      }
    });

    return palavrasList;
  }

}
