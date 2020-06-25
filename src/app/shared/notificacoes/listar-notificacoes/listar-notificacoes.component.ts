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
  set notificacoes(value: Notificacao[]) {
    if (value) {
      this.notifications = value;
      if (this.showVerMais) {
        this.notifications.forEach((notificacao, index) => {
          if (index > 4) {
            this.notifications.splice(index, 1);
          }
        });
      }
    }
  }

  @Input()
  config: any;

  @Input()
  showVerMais = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onDelete(notification: Notificacao) {
    this.delete.emit(notification);
  }
}
