import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'art-message-box',
  templateUrl: './art-message-box.component.html',
  styleUrls: ['./art-message-box.component.scss']
})
export class ArtMessageBoxComponent implements OnInit {
  @Input()
  message = 'Sem dados.';

  @Input()
  style: string;
  @Input()
  roundness: string;

  constructor() {
    this.style = 'muted';
    this.roundness = 'rounded';
  }

  ngOnInit(): void {
    if (
      this.style !== 'muted'
      && this.style !== 'info'
      && this.style !== 'warning'
      && this.style !== 'danger'
      && this.style !== 'success'
    ) {
      console.warn(`Olá, eu sou o componente de mensagem do Arthur.
      \nVocê me passou [style]="${this.style}", só que eu não sei o que fazer com isso.
      Eu só conheço os styles
      'muted'    (cinzinha)
      'info'     (azulzinho)
      'warning'  (amarelinho)
      'danger'   (vermelhinho)
      'success'  (verdinho)

      Eu vou ficar branquinho! ⊙﹏⊙
      `);
    }
  }

}
