import { Relato } from './../../model/relato';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-relato-card',
  templateUrl: './relato-card.component.html',
  styleUrls: ['./relato-card.component.scss']
})
export class RelatoCardComponent implements OnInit {
  @Input() relato: Relato;
  relatoOpened = new EventEmitter<any>();

  constructor() { }

  getComplete(time) {
    return moment(time).format('DD/MM/YYYY HH:mm');
  }
  getFromNow(time) {
    return moment(time).fromNow();
  }
  ngOnInit(): void {
    console.log('relato in card', this.relato);

  }

  opened() {
    this.relatoOpened.emit(this.relato);
  }

}
