import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DadosService} from '../../services/dados.service';
import {NotificacoesService} from '../../services/notificacoes.service';
import {SnackService} from '../../services/snack.service';

@Component({
  selector: 'app-notificacao-modal',
  templateUrl: './responsavel-modal.component.html',
  styleUrls: ['./responsavel-modal.component.scss']
})
export class ResponsavelModalComponent implements OnInit {

  modalHeight: number;

  title: string;
  description: string;
  yesButton: string;
  noButton: string;
  yesButtonMatColor: string;
  responsaveisArray: any;
  paciente: any;
  responsavelSelected: any;

  constructor(public dialogRef: MatDialogRef<ResponsavelModalComponent>,
              private dados: DadosService,
              private snack: SnackService,
              private notifications: NotificacoesService,
              @Inject(MAT_DIALOG_DATA) data) {
    console.log(data);
    this.modalHeight = data.modalHeight;
    this.title = data.title;
    this.description = data.description;
    this.yesButton = data.yesButton;
    this.noButton = data.noButton;
    this.paciente = data.paciente;
    this.yesButtonMatColor = data.yesButtonMatColor;
  }

  ngOnInit(): void {
    this.listPsicologos();
  }

  onChange(responsavel) {
    console.log(responsavel.value);
    this.responsavelSelected = responsavel.value;
  }

  listPsicologos() {
    this.dados.listPsicologos().subscribe(res => {
      console.log('responsaveis', res);
      this.responsaveisArray = res;
    });
  }

  onCloseClicked(response) {
    this.dialogRef.close(response);
  }

  onSubmit() {
    this.notifications.sendNotification({
      pacienteUID: this.paciente.uid,
      type: 'troca-responsavel',
      relatoId: this.paciente.uid,
      responsavelUID: this.responsavelSelected.uid,
      message: 'Você recebeu um pedido para se tornar responsável por um novo paciente',
    }, this.responsavelSelected.uid);
    this.onCloseClicked(false);
    this.snack.success('Uma pedido foi enviado para que ' + this.responsavelSelected.dadosUsuario.nomeCompleto + ' assuma a responsabilidade pelo paciente.');
  }

  getModalStyle() {
    return (this.modalHeight - 48).toString() + 'px';
  }
}
