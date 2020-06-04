import { Relato } from './../../model/relato';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-relato-card',
  templateUrl: './relato-card.component.html',
  styleUrls: ['./relato-card.component.scss']
})
export class RelatoCardComponent implements OnInit {
  @Input() relato: Relato;
  constructor() { }

  ngOnInit(): void {
    console.log('relato in card', this.relato);

  }

}
