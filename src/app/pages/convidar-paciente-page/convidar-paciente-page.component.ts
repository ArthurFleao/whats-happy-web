import { ErrorHandlerService } from './../../services/error-handler.service';
import { environment } from './../../../environments/environment.prod';
import { ConvitesService } from './../../services/convites.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SnackService } from 'src/app/services/snack.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { DadosService } from 'src/app/services/dados.service';

@Component({
  selector: 'app-convidar-paciente-page',
  templateUrl: './convidar-paciente-page.component.html',
  styleUrls: ['./convidar-paciente-page.component.scss']
})
export class ConvidarPacientePageComponent implements OnInit {
  loading = false; // carregando?
  myUid: string; // uid do usuário
  conviteId;
  link: any;

  constructor(
    private auth: AuthService,
    private snack: SnackService,
    private eh: ErrorHandlerService,
    private convites: ConvitesService,
    private afs: AngularFirestore,
    private db: DadosService) {
    this.auth.me().then(res => { // recupera info do usuario
      this.myUid = res.uid; // salva uid do usuario
    }, error => {
      this.eh.handle(error);
    });
  }

  ngOnInit(): void {
  }

  onRegister(values) {
    this.loading = true;
    this.convites.newConvite(this.myUid, values.nomeCompleto, values.email).then((result) => {
      console.log('result', result);
      this.loading = false;
      this.snack.success('Convite para ' + values.nomeCompleto + ' criado com sucesso!');
      this.conviteId = result.id;
      this.link = window.location.origin + '/convite/' + this.conviteId;
    }).catch((err) => {

    });
  }

  // onRegister(values) { // ao clicar em cadastrar
  //   this.loading = true; // indica que está carregando algo // indica que está carregando algo
  //   this.auth.register(values.dadosUsuario.email, values.dadosUsuario.senha).then((res) => {
  //     const dadosUsuario: DadosUsuario = {
  //       cpf: values.dadosUsuario.cpf,
  //       nomeCompleto: values.dadosUsuario.nomeCompleto,
  //       dataNascimento: values.dadosUsuario.data,
  //       sexo: values.dadosUsuario.sexo,
  //       telefone: values.dadosUsuario.telefone,
  //       endereco: {
  //         bairro: values.endereco.bairro,
  //         cep: values.endereco.cep,
  //         logradouro: values.endereco.logradouro,
  //         numero: values.endereco.numero,
  //         uf: values.endereco.uf,
  //       }
  //     };
  //     const paciente: Paciente = {
  //       responsavel: this.afs.collection('psicologos').doc(this.myUid).ref,
  //       dadosUsuario
  //     };
  //     this.db.dadosUsuarioSave(res.user.uid, dadosUsuario).then((user) => {
  //       this.db.pacienteSave(res.user.uid, paciente).then((result) => {
  //         this.afs.collection('psicologos/' + this.myUid + '/pacientes').doc(res.user.uid).set({
  //           paciente: this.afs.collection('pacientes').doc(res.user.uid).ref
  //         }).then((finli) => {
  //           this.loading = false; // indica que terminou de carregar
  //           this.snack.success('Paciente cadastrado com sucesso!');
  //         }).catch((err) => {
  //           console.error(err);
  //         });
  //       });
  //     }).catch((err) => {
  //       console.error(err);
  //     });
  //   }).catch((err) => {
  //     console.error(err);
  //   });
  // }

}
