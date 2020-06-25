import { NotificacoesService } from './../../../services/notificacoes.service';
import { ConfirmModalComponent } from './../confirm-modal/confirm-modal.component';
import { Notificacao } from './../../../model/notificacao';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notificacao-card',
  templateUrl: './notificacao-card.component.html',
  styleUrls: ['./notificacao-card.component.scss']
})
export class NotificacaoCardComponent implements OnInit {
  @Output()
  delete = new EventEmitter();

  @Input()
  notificacao: Notificacao;

  @Input() set config(value) {
    this.notificacaoConfig = {
      titleSize: '18px',
      iconSize: '24px',
      imgWrapperSize: '50px',
      titleWeight: '500',
      iconBackgroundColor: '#222969',
      iconColor: 'white'
    };

    if (value) {
      this.notificacaoConfig = { ...this.notificacaoConfig, ...value };
    }
  }

  notificacaoConfig: any;

  constructor(
    public matDialog: MatDialog,
    private notificacoes: NotificacoesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // console.log(this.notificacao);
  }

  openRelato() {
    console.log(this.notificacao);

  }
  deleteNotification(event) {
    event.stopPropagation();
    event.preventDefault();
    const height = 300;
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'modal-component';
    // dialogConfig.height = height.toString() + 'px';
    dialogConfig.width = '600px';
    dialogConfig.data = {
      modalHeight: height,
      title: 'Deseja mesmo excluir essa notificação?',
      description: 'Você irá excluir a notificação com a seguinte mensagem: '
        + this.notificacao.message,
      yesButton: 'Excluir',
      noButton: 'Cancelar',
      yesButtonMatColor: 'warn',
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ConfirmModalComponent, dialogConfig);
    modalDialog.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        console.log('emit');
        this.delete.emit(this.notificacao);
      }
    });
  }

}
