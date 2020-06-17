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

  audioIsFucked;

  @Output()
  relatoOpened = new EventEmitter<any>();
  audioIsUploading: boolean;
  private onDestroy$ = new EventEmitter();

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
    this.afs.collection('pacientes/' + this.relato.pacienteUid + '/relatos').doc(this.relato.uid).valueChanges()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res: Relato) => {
        const updateRelato: Relato = res;
        updateRelato.pacienteUid = this.relato.pacienteUid;
        updateRelato.uid = this.relato.uid;
        updateRelato.dataHora = this.relato.dataHora;
        this.relato = updateRelato;
      }, error => {
        console.error(error);
      });
  }

  checkAudio() {
    if (this.relato.hasAudio) {
      if (this.relato.audioUploaded) {
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

}
