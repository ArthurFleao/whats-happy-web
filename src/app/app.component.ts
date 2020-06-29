import { AuthService } from './services/auth.service';
import { DadosService } from './services/dados.service';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private afMessaging: AngularFireMessaging,
    private auth: AuthService,
    private dados: DadosService) {
    this.auth.user$.subscribe(res => {
      if (res.uid){
        this.requestPermission(res.uid);
      }
    }, error => {
      console.error(error);
    });
    moment.locale('pt-BR');
    this.afMessaging.messages
      .subscribe((message) => {
        console.log('mensagem no subscribe geral', message);
      });
  }

  requestPermission(uid) {
    this.afMessaging.requestToken
      .subscribe(
        (token) => {
          this.dados.dadosUsuarioUpdate(uid, { deviceId: token }).then((result) => {
            console.log('token do man salvo no banco', token);
          }).catch((err) => {
            console.error(err);
          });
        },
        (error) => { console.error(error); },
      );
  }
}
