import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DadosService } from 'src/app/services/dados.service';
import { DadosUsuario } from 'src/app/model/dadosUsuario';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { forkJoin, Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-listar-pacientes-page',
  templateUrl: './listar-pacientes-page.component.html',
  styleUrls: ['./listar-pacientes-page.component.scss']
})
export class ListarPacientesPageComponent implements OnInit {

  // loading = true;
  myUid: string;
  dadosUsuario: any;
  loading = true;
  pacientes = new Subject<Array<any>>();

  constructor(
    private authService: AuthService,
    private db: DadosService,
    private afs: AngularFirestore,
    private eh: ErrorHandlerService,
  ) {

    // recupera id do usuário logado
    this.authService.me().then(myRes => {
      this.myUid = myRes.uid;
      console.log('my uid', this.myUid);

      // chama funcao do auth.service para recuperar dados do usuario logado
      this.db.getListaPacientes(this.myUid).subscribe(res => {

        const arrayTodosPacientes = [];

        console.log('res: ', res);

        res.forEach((paciente: any) => {
          // coloca todos os pacientes do psicologo no array

          arrayTodosPacientes.push(this.afs.doc(paciente.paciente).valueChanges().pipe(first(), map(pres => {
            let newRes: any = pres;
            newRes.uid = this.afs.doc(paciente.paciente).ref.id;
            return pres;
          })));
        });
        forkJoin(arrayTodosPacientes).subscribe(
          arrayPacientes => {
            this.pacientes.next(arrayPacientes);
            console.log('pacientes:', arrayPacientes);
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



}
