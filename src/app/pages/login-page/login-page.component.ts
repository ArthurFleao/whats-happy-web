import { DadosService } from './../../service/dados.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Psicologo } from './../../model/psicologo';
import { DadosUsuario, Endereco } from './../../model/dadosUsuario';
import { AuthService } from './../../services/auth.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { SnackService } from 'src/app/services/snack.service';
@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loading = false;
  estado = 'login';
  constructor(
    private router: Router,
    private db: DadosService,
    private authService: AuthService,
    private snack: SnackService,
  ) { }

  ngOnInit(): void {
  }
  test() {
    console.log('trying');
    this.authService.testRegister()({ test: 'wtf' }).subscribe(res => {
      console.log(res);
    }, error => {
      console.error(error);
    });
  }

  onSubmit(values) { // quando clicar no botão submit
    // chama método de login de auth.service
    console.log(values);
    this.loading = true; // indica que está carregando algo
    this.authService.login(values.login, values.senha).then(value => {
      this.loading = false; // indica que terminou de carregar
      console.log('deu certo');
      // redireciona para a pagina home do sistema
      this.router.navigate(['home']);
    })
      .catch(err => {
        console.log('Erro:', err.message);
      });

  }

  onLogout() {
    this.authService.logout();
    console.log('afdad');
  }

  onRegister(values) { // quando clicar no botão registrar
    console.log('values', values);
    this.loading = true; // indica que está carregando algo
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
      this.db.dadosUsuarioSave(res.user.uid, dadosUsuario).then((result) => {
        this.db.psicologoSave(res.user.uid, psicologo).then((result) => {
          this.loading = false; // indica que terminou de carregar
          this.snack.success('Você se registrou com sucesso!');
        }).catch((err) => {
          console.error(err);
        });
      }).catch((err) => {
        console.error(err);
      });

    }).catch((err) => {
      console.error(err);
    });
  }

}
