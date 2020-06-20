import { Component, OnInit } from '@angular/core';
import { DadosService } from 'src/app/services/dados.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-listar-convites',
  templateUrl: './listar-convites.component.html',
  styleUrls: ['./listar-convites.component.scss']
})
export class ListarConvitesComponent implements OnInit {

  myUid: string;

  constructor(
    private db: DadosService,
    private authService: AuthService,
  ) {

    this.authService.me().then(res => {
      this.myUid = res.uid;

      this.db.listarConvites(this.myUid).subscribe(querySnapshot => {

        let arrayAux = new Array<any>()

        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          arrayAux.push(doc.data())
        })
      })
    });

   }

  ngOnInit(): void {
  }



}
