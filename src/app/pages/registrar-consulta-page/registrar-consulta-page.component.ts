import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackService } from 'src/app/services/snack.service';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { DadosService } from 'src/app/services/dados.service';
import { AuthService } from 'src/app/services/auth.service';
import { DadosUsuario } from 'src/app/model/dadosUsuario';
import * as firebase from 'firebase';
import { forkJoin, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-consulta-page',
  templateUrl: './registrar-consulta-page.component.html',
  styleUrls: ['./registrar-consulta-page.component.scss']
})
export class RegistrarConsultaPageComponent implements OnInit {

  loading = true;
  myUid: string;
  dadosUsuario: any;
  pacientes = new Subject<Array<any>>();

  constructor(
    private authService: AuthService,
    private db: DadosService,
    private afs: AngularFirestore,
    private eh: ErrorHandlerService,
    private snack: SnackService,
    private router: Router
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

  registrarConsulta(values){
    this.loading = false; // indica que está carregando algo // indica que está carregando algo

    console.log("values", values)

    this.afs.collection('pacientes').doc(values.dadosUsuario.idPaciente.uid).collection('fichasConsultas').add({

      dcHda: values.registroConsulta.dcHda,
      reacoesFrenteDiagnostico: values.registroConsulta.reacoesFrenteDiagnostico,
      estadoEmocionalAtual: values.registroConsulta.estadoEmocionalAtual,
      historicoPessoal: values.registroConsulta.historicoPessoal,
      examePsiquico: values.registroConsulta.examePsiquico,
      condutaPsicologica: values.registroConsulta.condutaPsicologica,
      orientacao: values.registroConsulta.orientacao,
      Outros: values.registroConsulta.Outros,
      dataHora: firebase.firestore.FieldValue.serverTimestamp(),
      idPsicologo: this.myUid

    }).then((finli) => {
     this.loading = false; // indica que terminou de carregar
      this.snack.success('Consulta registrada com sucesso!');
      this.router.navigate(['/home']);
    }).catch((err) => {
     this.eh.handle(err);
    });

  }

}
