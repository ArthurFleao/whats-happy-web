import { DadosService } from '../../services/dados.service';
import { Paciente } from './../../model/paciente';
import { DadosUsuario } from './../../model/dadosUsuario';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SnackService } from 'src/app/services/snack.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-cadastrar-paciente',
  templateUrl: './cadastrar-paciente.component.html',
  styleUrls: ['./cadastrar-paciente.component.scss']
})
export class CadastrarPacienteComponent implements OnInit {
  loading = false; // carregando?
  myUid: string; // uid do usuário

  constructor(private auth: AuthService, private snack: SnackService, private afs: AngularFirestore, private db: DadosService) {
    this.auth.me().then(res => { // recupera info do usuario
      this.myUid = res.uid; // salva uid do usuario
    }, error => {
      console.error(error);
    });
  }

  ngOnInit(): void {
  }

  onRegister(values) { // ao clicar em cadastrar
    this.loading = true; // indica que está carregando algo // indica que está carregando algo
    this.auth.register(values.dadosUsuario.email, values.dadosUsuario.senha).then((res) => {
      const dadosUsuario: DadosUsuario = {
        cpf: values.dadosUsuario.cpf,
        nomeCompleto: values.dadosUsuario.nomeCompleto,
        dataNascimento: values.dadosUsuario.data,
        sexo: values.dadosUsuario.sexo,
        telefone: values.dadosUsuario.telefone,
        endereco: {
          bairro: values.endereco.bairro,
          cep: values.endereco.cep,
          logradouro: values.endereco.logradouro,
          numero: values.endereco.numero,
          uf: values.endereco.uf,
        }
      };
      const paciente: Paciente = {
        responsavel: this.afs.collection('psicologos').doc(this.myUid).ref,
        dadosUsuario
      };
      this.db.dadosUsuarioSave(res.user.uid, dadosUsuario).then((user) => {
        this.db.pacienteSave(res.user.uid, paciente).then((result) => {
          this.afs.collection('psicologos/' + this.myUid + '/pacientes').doc(res.user.uid).set({
            paciente: this.afs.collection('pacientes').doc(res.user.uid).ref
          }).then((finli) => {
            this.loading = false; // indica que terminou de carregar
            this.snack.success('Paciente cadastrado com sucesso!');
          }).catch((err) => {
            console.error(err);
          });
        });
      }).catch((err) => {
        console.error(err);
      });
    }).catch((err) => {
      console.error(err);
    });
  }

}
