import { Paciente } from './../../model/paciente';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SnackService } from 'src/app/services/snack.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ConvitesService } from 'src/app/services/convites.service';
import { DadosService } from 'src/app/services/dados.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-listar-relatos-page',
  templateUrl: './listar-relatos-page.component.html',
  styleUrls: ['./listar-relatos-page.component.scss']
})
export class ListarRelatosPageComponent implements OnInit {
  paciente$ = new Subject<any>(); // TODO: TEMPO REAL
  loading = true;
  loadingRelatos;
  paciente;
  relatos;
  pacienteUid;


  constructor(
    private auth: AuthService,
    private snack: SnackService,
    private afs: AngularFirestore,
    private router: Router,
    private eh: ErrorHandlerService,
    private convites: ConvitesService,
    private db: DadosService,
    private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.pacienteUid = (params.get('id'));
      this.db.getPacienteData(params.get('id')).subscribe(res => {
        this.paciente$.next(res);
        this.paciente = res;
        this.loadingRelatos = true;
        this.db.listRelatos(params.get('id')).subscribe(relatos => {
          this.relatos = relatos;
          console.log('relatos', relatos);

          this.loadingRelatos = false;
        }, error => {
          this.eh.handle(error);
          this.loadingRelatos = false;
        });
        console.log('paciente:', res);
        this.loading = false;
        if (!res) {
          this.snack.danger('Paciente não encontrado.');
          this.router.navigate(['/home']);
        }
      }, error => {
        this.eh.handle(error);
      });
    });
  }

  opened(relato) {
    this.db.markRelatoAsSeen(this.pacienteUid, relato.uid);
  }

  ngOnInit(): void {
  }

}
