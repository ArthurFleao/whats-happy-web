import { ErrorHandlerService } from './../../services/error-handler.service';
import { NotificacoesService } from './../../services/notificacoes.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observer, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { Notificacao } from 'src/app/model/notificacao';
import { SnackService } from 'src/app/services/snack.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
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
    this.checkWindow();

    // interval(4000).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
    //   this.listNotificacoes();
    //   this.notificacaoService.countNaoLidas().subscribe(quantidade => {
    //     this.quantidadeNotificacoesNaoLidas = quantidade;
    //   });
    // });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWindow();
  }
  checkWindow() {
    if (window.innerWidth < 769) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  ngOnInit(): void {
    this.user = this.auth.user$;
    this.auth.user$.subscribe(res => {
      this.listNotificacoes(res.uid);
    }, error => {
      console.error(error);
    });
    // this.contaService.get().subscribe(res => {
    //   this.conta = res;
    // }, error => {
    //   this.eh.handle(error);
    // });
    // this.listNotificacoes();
    // this.notificationConfig = {
    //   titleSize: '14px',
    //   imgWrapperSize: '35px',
    // };

    // this.notificacaoService.countNaoLidas().subscribe(quantidade => {
    //   this.quantidadeNotificacoesNaoLidas = quantidade;
    // });
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  toggleSideMenu() {
    this.openedSideMenu = !this.openedSideMenu;
    this.openedSideMenuChange.emit(this.openedSideMenu);
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
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
