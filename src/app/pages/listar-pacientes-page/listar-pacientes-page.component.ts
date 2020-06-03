import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DadosService } from 'src/app/services/dados.service';
import { DadosUsuario } from 'src/app/model/dadosUsuario';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-listar-pacientes-page',
  templateUrl: './listar-pacientes-page.component.html',
  styleUrls: ['./listar-pacientes-page.component.scss']
})
export class ListarPacientesPageComponent implements OnInit {

  //loading = true;
  myUid: string;
  dadosUsuario: any;

  constructor(
    private authService: AuthService,
    private db: DadosService,
    private afs: AngularFirestore
  ) {

    // recupera id do usuário logado
    this.authService.me().then(res => {
      this.myUid = res.uid;
      console.log('my uid', this.myUid);

      // chama funcao do auth.service para recuperar dados do usuario logado
      this.db.getListaPacientes(this.myUid).subscribe( res => {

        let arrayTodosPacientes = []

        console.log("res: ", res)

        res.forEach( (paciente: any) => {
          //coloca todos os pacientes do psicologo no array
          console.log(this.afs.doc(paciente.paciente).ref.id);
           this.afs.doc(paciente.paciente).valueChanges().subscribe(eae => {
console.log('Oi', eae);

           })
          arrayTodosPacientes.push( this.afs.doc(paciente.paciente).valueChanges().pipe(first()) )
          console.log("arrayTodosPacientes: ", arrayTodosPacientes)
        })
          forkJoin(arrayTodosPacientes).subscribe(
            arrayPacientes => {
              console.log("arrayPacientes: ", arrayPacientes)
          }, err => {
            console.error(err);

          })



      }, error => {
        console.error(error);
      });
    });

   }

  ngOnInit(): void {
  }

  listarPacientes(){

  }


}
