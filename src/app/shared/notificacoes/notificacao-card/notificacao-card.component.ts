import {DadosUsuario} from './../../../model/dadosUsuario';
import {first} from 'rxjs/operators';
import {DadosService} from 'src/app/services/dados.service';
import {NotificacoesService} from './../../../services/notificacoes.service';
import {ConfirmModalComponent} from './../confirm-modal/confirm-modal.component';
import {Notificacao} from './../../../model/notificacao';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {ErrorHandlerService} from '../../../services/error-handler.service';
import {SnackService} from '../../../services/snack.service';

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
  dataFromNow: string;
  private nomePaciente: string;

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
      this.notificacaoConfig = {...this.notificacaoConfig, ...value};
    }
  }

  notificacaoConfig: any;

  constructor(
    public matDialog: MatDialog,
    private notificacoes: NotificacoesService,
    private dados: DadosService,
    private snack: SnackService,
    private eh: ErrorHandlerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // console.log('notificacao', this.notificacao);

    this.dataFromNow = moment(this.notificacao.data).fromNow();
    this.notificacao.data = moment(this.notificacao.data).format('DD/MM/YYYY HH:mm');
    if (this.notificacao.type === 'novo-relato' || this.notificacao.type === 'convite-aceito') {
      const originalMessage = this.notificacao.message;
      this.notificacao.message = 'Seu paciente ' + originalMessage;
      this.dados.getUserData(this.notificacao.pacienteUID).pipe(first()).subscribe((res: DadosUsuario) => {
        this.notificacao.message = res.nomeCompleto + ' ' + originalMessage;
      }, error => {
        console.error(error);
      });
    }

    if (this.notificacao.type === 'troca-responsavel') {
      this.notificacao.message = 'Você recebeu um pedido para se tornar responsável pelo paciente ';
      this.dados.getUserData(this.notificacao.pacienteUID).pipe(first()).subscribe((res: DadosUsuario) => {
        this.notificacao.message += res.nomeCompleto;
        this.nomePaciente = res.nomeCompleto;
      }, error => {
        console.error(error);
      });
    }
    // console.log(this.notificacao);
  }

  marcarComoLida() {
    // quem é essa lida? kkkk

    if (!this.notificacao.lida) {
      this.notificacoes.marcarComoLida(this.notificacao.responsavelUID, this.notificacao.uid);
      this.notificacao.lida = true;
    }
  }

  openRelato() {
    console.log(this.notificacao);
    if (this.notificacao.type === 'troca-responsavel') {
      this.openConfirmarTrocaModal();
    } else {
      this.router.navigate(['/paciente', this.notificacao.pacienteUID, 'relatos']);
    }

  }

  openConfirmarTrocaModal() {
    const height = 300;
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'modal-component';
    // dialogConfig.height = height.toString() + 'px';
    dialogConfig.width = '600px';
    dialogConfig.data = {
      modalHeight: height,
      title: 'Confirma a troca de responsabilidade?',
      description: 'Você se tornará o psicólogo responsável pelo paciente ' + (this.nomePaciente || 'novo') + '.',
      yesButton: 'Aceitar',
      noButton: 'Cancelar',
      yesButtonMatColor: 'warn',
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ConfirmModalComponent, dialogConfig);
    modalDialog.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        this.dados.updateResponsavel(this.notificacao.pacienteUID, this.notificacao.responsavelUID).then(res => {
          this.snack.success('Você assumiu a responsabilidade pelo paciente ' + (this.nomePaciente || 'novo') + '!');
        }, error => {
          this.eh.handle(error);
        });
      }
    });
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
