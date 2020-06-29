import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notificacao } from 'src/app/model/notificacao';

@Component({
  selector: 'app-listar-notificacoes',
  templateUrl: './listar-notificacoes.component.html',
  styleUrls: ['./listar-notificacoes.component.scss']
})
export class ListarNotificacoesComponent implements OnInit {
  @Output()
  delete = new EventEmitter();

  notifications: Notificacao[];

  @Input()
  showVerMais = false;
  badgeVerMais: boolean;

  naoLidasVerMais = 0;



  @Input()
  set notificacoes(value: Notificacao[]) {
    if (value) {
      const newArray = value;
      this.notifications = [];
      this.badgeVerMais = false;
      this.naoLidasVerMais = 0;
      if (this.showVerMais) {
        newArray.forEach((notificacao, index) => {
          if (index < 5) {
            this.notifications.push(notificacao);
          } else if (!notificacao.lida) {
            this.badgeVerMais = true;
            this.naoLidasVerMais++;
          }
        });
      } else {
        this.notifications = newArray;
      }
    }
  }

  @Input()
  config: any;


  constructor() {
  }

  ngOnInit(): void {
  }

  onDelete(notification: Notificacao) {
    this.delete.emit(notification);
  }
}
