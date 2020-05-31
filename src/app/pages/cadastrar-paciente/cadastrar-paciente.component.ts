import { DadosService } from './../../service/dados.service';
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
  loading = false;
  myUid: string;

  constructor(private auth: AuthService, private snack: SnackService, private afs: AngularFirestore, private db: DadosService) {
    this.auth.me().then(res => {
      this.myUid = res.uid;
      console.log('my uid', this.myUid);
      console.log('display name', res.displayName);
      console.log('all of it', res);

    }, error => {
      console.error(error);
    });
  }

  ngOnInit(): void {
  }

  onRegister(values) {
    this.loading = true;
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
            this.loading = false;
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
