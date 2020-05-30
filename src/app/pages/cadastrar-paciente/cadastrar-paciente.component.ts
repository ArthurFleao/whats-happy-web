import { Paciente } from './../../model/paciente';
import { DadosUsuario } from './../../model/dadosUsuario';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SnackService } from 'src/app/services/snack.service';

@Component({
  selector: 'app-cadastrar-paciente',
  templateUrl: './cadastrar-paciente.component.html',
  styleUrls: ['./cadastrar-paciente.component.scss']
})
export class CadastrarPacienteComponent implements OnInit {
  loading = false;

  constructor(private auth: AuthService, private snack: SnackService) { }

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
        responsavel: 'TODO: meu id',
        dadosUsuario
      };
      this.auth.dadosUsuarioSave(res.user.uid, dadosUsuario).then((result) => {
        this.auth.pacienteSave(res.user.uid, paciente).then((result) => {
          this.loading = false;
          this.snack.success('Paciente registrado com sucesso!');
        }).catch((err) => {
          console.error(err);
        });
      }).catch((err) => {
        console.error(err);
      });


    });
  }

}
