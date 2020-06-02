import { ConvitesService } from './../../services/convites.service';
import { DadosService } from '../../services/dados.service';
import { Paciente } from './../../model/paciente';
import { DadosUsuario } from './../../model/dadosUsuario';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SnackService } from 'src/app/services/snack.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastrar-paciente',
  templateUrl: './cadastrar-paciente.component.html',
  styleUrls: ['./cadastrar-paciente.component.scss']
})
export class CadastroPacienteComponent implements OnInit {
  loading = false; // carregando?
  convite: any;

  constructor(private auth: AuthService,
              private snack: SnackService,
              private afs: AngularFirestore,
              private convites: ConvitesService,
              private db: DadosService,
              private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.convites.getConvite(params.get('id')).subscribe(res => {
        this.convite = res;
      }, error => {
        console.error(error);
      });
    });
  }

  ngOnInit(): void {
  }
  test() {
    console.log('test convite', this.convite);
  }

  onRegister(values) { // ao clicar em cadastrar
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

      this.auth.registerPaciente({
        uid: res.user.uid,
        responsavelUid: this.convite.psicologo.uid,
        dadosUsuario
      }).subscribe(res => {
        console.log('Registered!');

      }, error => {
        console.error(error);
      });
    });
  }

}
