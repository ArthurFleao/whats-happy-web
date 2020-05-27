import { DadosUsuario, Endereco } from './../../model/dadosUsuario';
import { AuthService } from './../../services/auth.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  estado = 'login';
  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(values) { // quando clicar no botão submit
    console.log(values);
  }

  onRegister(values) { // quando clicar no botão registrar
    console.log('values', values);
    this.auth.register(values.dadosUsuario.email, values.dadosUsuario.senha, values.dadosUsuario.senha).then((result) => {
      console.log('result', result);
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
      this.auth.dadosUsuarioSave(result.user.uid, dadosUsuario).then((result) => {
        console.log('salvou', result);
      }).catch((err) => {
        console.error(err);
      });
    }).catch((err) => {
      console.error(err);
    });
  }
}
