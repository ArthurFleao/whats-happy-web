import { ErrorHandlerService } from './../../services/error-handler.service';
import { AudioStorageService } from './../../services/audio-storage.service';
import { Relato } from './../../model/relato';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-relato-card',
  templateUrl: './relato-card.component.html',
  styleUrls: ['./relato-card.component.scss']
})
export class RelatoCardComponent implements OnInit {
  @Input() relato: Relato;
  audioUrl;

  audioIsFucked;

  @Output()
  relatoOpened = new EventEmitter<any>();

  constructor(
    private audioStore: AudioStorageService,
    private eh: ErrorHandlerService
  ) { }

  getComplete(time) {
    return moment(time).format('DD/MM/YYYY HH:mm');
  }
  getFromNow(time) {
    return moment(time).fromNow();
  }
  ngOnInit(): void {
    if (this.relato.hasAudio) {
      this.audioStore.getRelatoAudio(this.relato.pacienteUid, this.relato.uid).subscribe(res => {
        this.audioUrl = res;
      }, error => {
        this.audioIsFucked = true;
      });
    }

  }

  opened() {
    if (this.relato.new) {
      this.relato.new = false;
      this.relatoOpened.emit(this.relato);
    }
  }

}
