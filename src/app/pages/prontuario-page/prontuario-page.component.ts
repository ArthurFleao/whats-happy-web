import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DadosService } from 'src/app/services/dados.service';
import { DadosUsuario } from 'src/app/model/dadosUsuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { SnackService } from 'src/app/services/snack.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prontuario-page',
  templateUrl: './prontuario-page.component.html',
  styleUrls: ['./prontuario-page.component.scss']
})
export class ProntuarioPageComponent implements OnInit {

  loading = true;
  myUid: string;
  dadosUsuario: any;

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
      console.log('my uid', this.myUid);

      // chama funcao do auth.service para recuperar dados do usuario logado
      this.db.getUserData(this.myUid).subscribe((resDadosUsuario: DadosUsuario) => {
        this.dadosUsuario = resDadosUsuario;
        this.dadosUsuario.email = res.email;
        this.loading = false; // indica que terminou de carregar
        console.log('tudo: ', this.dadosUsuario);
      }, error => {
        this.eh.handle(error);
        this.loading = false; // indica que terminou de carregar
      });

    });
  }

  ngOnInit(): void {
  }

  salvarProntuario(values){
    this.loading = false; // indica que está carregando algo // indica que está carregando algo

    console.log("Prontuario", values.prontuario)

    //FIX: TROCAR PARA A ID DO PACIENTE
    this.afs.collection('pacientes').doc(this.myUid).collection('prontuarios').add({

      dcHda: values.prontuario.dcHda,
      reacoesFrenteDiagnostico: values.prontuario.reacoesFrenteDiagnostico,
      estadoEmocionalAtual: values.prontuario.estadoEmocionalAtual,
      historicoPessoal: values.prontuario.historicoPessoal,
      examePsiquico: values.prontuario.examePsiquico,
      condutaPsicologica: values.prontuario.condutaPsicologica,
      orientacao: values.prontuario.orientacao,
      Outros: values.prontuario.Outros,
      dataHora: firebase.firestore.FieldValue.serverTimestamp()

    }).then((finli) => {
      this.loading = false; // indica que terminou de carregar
      this.snack.success('Prontuário cadastrado com sucesso!');
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.error(err);
    });



  }

}
