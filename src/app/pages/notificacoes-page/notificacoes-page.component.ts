import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Notificacao } from 'src/app/model/notificacao';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackService } from 'src/app/services/snack.service';
import { NotificacoesService } from 'src/app/services/notificacoes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificacoes-page',
  templateUrl: './notificacoes-page.component.html',
  styleUrls: ['./notificacoes-page.component.scss']
})
export class NotificacoesPageComponent implements OnInit {

  private onDestroy$ = new EventEmitter();

  @Input()
  openedSideMenu: boolean;
  @Output()
  openedSideMenuChange = new EventEmitter();

  quantidadeNotificacoesNaoLidas = 0;
  notificacoes: Notificacao[];
  notificationConfig: any;
  showNotificacoes = false;
  user: Observable<User>;

  isMobile: boolean;

  constructor(
    private auth: AuthService,
    private eh: ErrorHandlerService,
    private snack: SnackService,
    private notificacoesService: NotificacoesService,
    private router: Router) {

  }


  ngOnInit(): void {
    this.auth.user$.subscribe(res => {
      this.listNotificacoes(res.uid);
    }, error => {
      console.error(error);
    });
  }


  listNotificacoes(uid) {
    this.notificacoesService.list(uid).subscribe((notificacoes: any) => {
      console.log('nots', notificacoes);

      this.notificacoes = notificacoes;
      this.quantidadeNotificacoesNaoLidas = 0;
      this.notificacoes.forEach(not => {
        if (!not.lida) {
          this.quantidadeNotificacoesNaoLidas++;
        }
      });
    });
  }

  openNotificacoes() {
    if (this.isMobile) {
      this.router.navigate(['/notificacoes']);
    } else { this.showNotificacoes = !this.showNotificacoes; }

  }
  onDeleteNotification(not: Notificacao) {
    this.notificacoesService.delete(not.responsavelUID, not.uid).then((result) => {
      this.snack.success('Notificação excluída com sucesso!', 'Adeus!');
    }).catch((err) => {
      this.eh.handle(err);
    });
  }

}
