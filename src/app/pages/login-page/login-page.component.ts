import { Psicologo } from './../../model/psicologo';
import { DadosUsuario, Endereco } from './../../model/dadosUsuario';
import { AuthService } from './../../services/auth.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  estado = 'login';
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(values) { // quando clicar no botão submit
    //chama método de login de auth.service    
    console.log(values);
    this.authService.login(values.login, values.senha);
  }

  onRegister(values) { // quando clicar no botão registrar
    console.log('values', values);
    this.authService.register(values.dadosUsuario.email, values.dadosUsuario.senha, values.dadosUsuario.senha).then((res) => {
      console.log('res', res);
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
      const psicologo: Psicologo = {
        crp: values.dadosUsuario.crp,
        dadosUsuario
      };
      this.authService.dadosUsuarioSave(res.user.uid, dadosUsuario).then((result) => {
        console.log('salvou', result);
      }).catch((err) => {
        console.error(err);
      });

      this.authService.psicologoSave(res.user.uid, psicologo).then((result) => {
        console.log('salvou', result);
      }).catch((err) => {
        console.error(err);
      });
    }).catch((err) => {
      console.error(err);
    });
  }
  
}
