import { Notificacao } from './../../../model/notificacao';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-notificacoes-popover',
  templateUrl: './notificacoes-popover.component.html',
  styleUrls: ['./notificacoes-popover.component.scss']
})
export class NotificacoesPopoverComponent implements OnInit {

  @Input() notificacoes: Notificacao[];
  @Input() config: any;

  @Output()
  delete = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
