import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observer, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/model/user';

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

  // quantidadeNotificacoesNaoLidas = 0;
  // notificacoes: ServerListResponse<NotificacaoModel>;
  // notificationConfig: NotificationCardConfig;
  // showNotificacoes = false;
  user: Observable<User>;

  isMobile: boolean;

  constructor(
    private auth: AuthService,
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

  // listNotificacoes() {
  //   this.notificacaoService.list(5, 0).subscribe(notificacoes => {
  //     this.notificacoes = notificacoes;
  //   });
  // }

  // openNotificacoes() {
  //   if (this.isMobile) {
  //     this.router.navigate(['dashboard/notificacao/listar']);
  //   } else { this.showNotificacoes = !this.showNotificacoes; }

  // }
  // onDeleteNotification(not: NotificacaoModel) {
  //   this.notificacaoService.delete(not).subscribe(() => {
  //     this.listNotificacoes();
  //   });
  // }
}
