import { DadosService } from './../../service/dados.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// formulário
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// model para usuario
import { DadosUsuario } from './../../model/dadosUsuario';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss']
})
export class PerfilPageComponent implements OnInit {

  formGroup: FormGroup;
  dadosUsuario: any;
  loading = true;
  myUid: string;

  constructor(
    private authService: AuthService,
    private db: DadosService,
    fb: FormBuilder
    ) {

    // recupera id do usuário logado
    this.authService.me().then(res => {
      this.myUid = res.uid;
      console.log('my uid', this.myUid);

      // chama funcao do auth.service para recuperar dados do usuario logado
      this.db.getUserData(this.myUid).subscribe((resDadosUsuario: DadosUsuario) => {
        this.dadosUsuario = resDadosUsuario;
        this.dadosUsuario.email = res.email;
        this.loading = false;
        console.log('tudo: ', this.dadosUsuario);
    }, error => {
      console.error(error);
      this.loading = false;
    });

   });
  }

  ngOnInit(): void {
  }

}
