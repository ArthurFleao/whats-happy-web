import { ErrorHandlerService } from './../../services/error-handler.service';
import { DadosService } from '../../services/dados.service';
import { Component, OnInit } from '@angular/core';
// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
// formulário
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// model para usuario
import { DadosUsuario } from './../../model/dadosUsuario';
// service para mensagens
import { SnackService } from 'src/app/services/snack.service';
// redirecionamento
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss']
})
export class PerfilPageComponent implements OnInit {

  formGroup: FormGroup;
  dadosUsuario: any;
  loading = false;
  loadingData = true;
  myUid: string;
  showCrp: boolean;
  private user = new User();
  flag: boolean;

  constructor(
    private authService: AuthService,
    private db: DadosService,
    private afs: AngularFirestore,
    private eh: ErrorHandlerService,
    private snack: SnackService,
    private router: Router,
    fb: FormBuilder
  ) {
    // recupera id do usuário logado
    this.authService.user$.subscribe(user => {
      console.log('////////////////////////////////////////');
      this.user = user;

      this.myUid = this.user.uid;

      // chama funcao do auth.service para recuperar dados do usuario logado
      this.db.getUserData(this.myUid).subscribe((resDadosUsuario: DadosUsuario) => {
        this.dadosUsuario = resDadosUsuario;
        this.dadosUsuario.email = this.user.dadosUsuario.email;
        this.authService.user$.subscribe(resauth => {
          console.log('res', resauth);
          if (resauth.dadosPsicologo?.crp) {
            this.showCrp = true;
            this.dadosUsuario.crp = resauth.dadosPsicologo.crp;
          } else {
            this.showCrp = false;
          }
          this.loadingData = false; // indica que terminou de carregar
        }, error => {
          console.error(error);
        });
      });
    }, error => {
      this.eh.handle(error);
      this.loadingData = false; // indica que terminou de carregar
    });

  }

  ngOnInit(): void {
  }

  updateData(values) {
    const data = values.dadosUsuario;
    data.endereco = values.endereco;

    this.loading = true; // indica que está carregando algo // indica que está carregando algo
    this.afs.collection('dadosUsuario').doc(this.myUid).update(data).then((finli) => {
      this.loading = false; // indica que terminou de carregar
      this.snack.success('Perfil editado com sucesso!');
      // FIX
      this.router.navigate(['/home']);
    }).catch((err) => {
      this.loading = false; // indica que terminou de carregar
      this.eh.handle(err);
    });
  }

  disableUser() {
    // se for paciente
    if (this.user.isPaciente === true && this.user.isPsicologo === false) {

      console.log('1 if');

      this.db.disablePaciente(this.myUid).then((result) => {
        this.finalizeDisable();
      }).catch((err) => {
        this.loading = false;
        this.eh.handle(err);
      });
    } else
      // se for psicologo
      if (this.user.isPaciente === false && this.user.isPsicologo === true) {
        console.log('2 if');
        this.db.disablePsicologo(this.myUid).then((result) => {
          this.finalizeDisable();
        }).catch((err) => {
          this.loading = false;
          this.eh.handle(err);
        });
      } else
        // se for ambos
        if (this.user.isPaciente === true && this.user.isPsicologo === true) {
          console.log('3 if');
          this.db.disablePaciente(this.myUid).then((result) => {
            this.finalizeDisable();
          }).catch((err) => {
            this.loading = false;
            this.eh.handle(err);
          });

          this.db.disablePsicologo(this.myUid).then((result) => {
            this.finalizeDisable();
          }).catch((err) => {
            this.loading = false;
            this.eh.handle(err);
          });
        }
  }

  finalizeDisable() {
    this.loading = false;
    this.snack.success('Sua conta foi desabilitada com sucesso!');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
