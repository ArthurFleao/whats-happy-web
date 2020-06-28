import { SnackService } from './../../services/snack.service';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { ConvitesService } from 'src/app/services/convites.service';
import { Convite } from './../../model/convite';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-convite-card',
  templateUrl: './convite-card.component.html',
  styleUrls: ['./convite-card.component.scss']
})
export class ConviteCardComponent implements OnInit {

  @Input()
  convite: Convite;
  loadingAction = false;
  constructor(
    private convitesService: ConvitesService,
    private eh: ErrorHandlerService,
    private snack: SnackService,
  ) { }

  ngOnInit(): void {
  }

  desabilitar() {
    this.loadingAction = true;
    this.convitesService.setCanceladoTo(this.convite.uid, true).then((result) => {
      this.snack.success('Convite desabilitado com sucesso!');
      this.convite.cancelado = true;
      this.loadingAction = false;
    }).catch((err) => {
      this.eh.handle(err);
    });
  }

  reabilitar() {
    this.loadingAction = true;
    this.convitesService.setCanceladoTo(this.convite.uid, false).then((result) => {
      this.snack.success('Convite reabilitado com sucesso!');
      this.convite.cancelado = true;
      this.loadingAction = false;
    }).catch((err) => {
      this.eh.handle(err);
    });
  }

  excluir() {
    this.loadingAction = true;
    this.convitesService.delete(this.convite.uid).then((result) => {
      this.snack.success('Convite excluído com sucesso!');
      this.loadingAction = false;
    }).catch((err) => {
      this.eh.handle(err);
    });
  }


}
