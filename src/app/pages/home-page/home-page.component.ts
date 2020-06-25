import { NotificacoesService } from './../../services/notificacoes.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private auth: AuthService, private notificacoes: NotificacoesService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(res => {
      this.notificacoes.list(res.uid).subscribe(res => {
        console.log('notifiacoes changed', res);
      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }

}
