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
  constructor(private afMessaging: AngularFireMessaging) {
    moment.locale('pt-BR');
  }

  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => { console.log('Permission granted! Save to the server!', token); },
        (error) => { console.error(error); },
      );
  }

  listen() {
    this.afMessaging.messages
      .subscribe((message) => { console.log(message); });
  }

}
