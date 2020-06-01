import { DadosService } from './../../service/dados.service';
import { Component, OnInit } from '@angular/core';
//Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
// formulário
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// model para usuario
import { DadosUsuario } from './../../model/dadosUsuario';
//service para mensagens
import { SnackService } from 'src/app/services/snack.service';
//redirecionamento
import { Router } from '@angular/router';

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
    private afs: AngularFirestore,
    private snack: SnackService,
    private router: Router,
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
        this.loading = false; // indica que terminou de carregar
        console.log('tudo: ', this.dadosUsuario);
    }, error => {
      console.error(error);
      this.loading = false; // indica que terminou de carregar
    });

   });
  }

  ngOnInit(): void {
  }

  updateData(values){

    this.loading = true; // indica que está carregando algo // indica que está carregando algo
    this.afs.collection('dadosUsuario').doc(this.myUid).update({
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
    }).then((finli) => {
      this.loading = false; // indica que terminou de carregar
      this.snack.success('Perfil editado com sucesso!');
      //FIX
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.error(err);
    });
  }

}
