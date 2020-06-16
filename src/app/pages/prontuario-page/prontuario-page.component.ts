import { Component, OnInit } from '@angular/core';
import { DadosService } from 'src/app/services/dados.service';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { forkJoin, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DadosUsuario } from 'src/app/model/dadosUsuario';
import { first, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-prontuario-page',
  templateUrl: './prontuario-page.component.html',
  styleUrls: ['./prontuario-page.component.scss']
})
export class ProntuarioPageComponent implements OnInit {

  arrayFichasCadastro: Array<any>
  pacientes = new Subject<Array<any>>();
  myUid: string;
  dadosUsuario: any;
  loading = true;

  constructor(
    private authService: AuthService,
    private dadosService: DadosService,
    private eh: ErrorHandlerService,
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

  getFichasConsultas(uid){
    this.dadosService.getProntuario(uid).subscribe(querySnapshot => {

      let arrayAux = new Array<any>()

      querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          arrayAux.push(doc.data())
      })

      this.arrayFichasCadastro = arrayAux

    }, error => {
    this.eh.handle(error)
    });
  }

}
