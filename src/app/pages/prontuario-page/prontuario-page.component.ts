import { Component, OnInit } from '@angular/core';
import { DadosService } from 'src/app/services/dados.service';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { forkJoin, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DadosUsuario } from 'src/app/model/dadosUsuario';
import { first, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { SnackService } from 'src/app/services/snack.service';

@Component({
  selector: 'app-prontuario-page',
  templateUrl: './prontuario-page.component.html',
  styleUrls: ['./prontuario-page.component.scss']
})
export class ProntuarioPageComponent implements OnInit {

  arrayFichasCadastro: Array<any>;
  pacientes = new Subject<Array<any>>();
  myUid: string;
  dadosUsuario: any;
  loading = false;

  constructor(
    private authService: AuthService,
    private dadosService: DadosService,
    private eh: ErrorHandlerService,
    private snack: SnackService,
    private db: DadosService,
    private afs: AngularFirestore,
  ) {

    // recupera id do usuário logado
    this.authService.me().then(res => {
      this.myUid = res.uid;

      // chama funcao do auth.service para recuperar dados do usuario logado
      this.db.getUserData(this.myUid).subscribe((resDadosUsuario: DadosUsuario) => {
        this.dadosUsuario = resDadosUsuario;
        this.dadosUsuario.email = res.email;
        this.loading = false; // indica que terminou de carregar
      }, error => {
        this.eh.handle(error);
        this.loading = false; // indica que terminou de carregar
      });

      // chama funcao do auth.service para recuperar dados do usuario logado
      this.db.getListaPacientes(this.myUid).subscribe(res => {
        const arrayTodosPacientes = [];
        res.forEach((paciente: any) => {
          // coloca todos os pacientes do psicologo no array
          arrayTodosPacientes.push(this.afs.doc(paciente.paciente).valueChanges().pipe(first(), map(pres => {
            const newRes: any = pres;
            newRes.uid = this.afs.doc(paciente.paciente).ref.id;
            return newRes;
          })));
        });
        forkJoin(arrayTodosPacientes).subscribe(
          arrayPacientes => {
            this.pacientes.next(arrayPacientes);
            this.loading = false;
          }, err => {
            this.loading = false;
            this.eh.handle(err);
          });
      }, error => {
        this.loading = false;
        this.eh.handle(error);
      });

    });

  }

  ngOnInit(): void {

  }
  onFichaSaved(ficha) {
    console.log('ficha saved', ficha);
    ficha.loading = true;
    this.afs.doc(ficha.uid).update(ficha.form.registroConsulta).then((result) => {
      ficha.loading = false;
      ficha.editando = false;
      this.snack.success('A ficha foi salva com sucesso!');
    }).catch((err) => {
      ficha.loading = false;
      this.eh.handle(err);
    });

  }

  getFichasConsultas(uid) {
    console.log('uid', uid); // :(
    if (typeof (uid) === 'string') {
      this.loading = true;
      this.dadosService.getProntuario(uid).subscribe(querySnapshot => {

        const arrayAux = new Array<any>();

        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          const data = doc.data();
          data.uid = doc.ref;
          arrayAux.push(data);
        });

        this.arrayFichasCadastro = arrayAux;
        console.log('arrayAux', arrayAux);
        this.loading = false;

      }, error => {
        this.loading = false;
        this.eh.handle(error);
      });
    }
  }

  updateProntuario(value) {
    console.log('aqui');
    console.log('value ', value);
  }

}
