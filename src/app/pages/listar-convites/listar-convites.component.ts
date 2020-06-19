import { Component, OnInit } from '@angular/core';
import { DadosService } from 'src/app/services/dados.service';

@Component({
  selector: 'app-listar-convites',
  templateUrl: './listar-convites.component.html',
  styleUrls: ['./listar-convites.component.scss']
})
export class ListarConvitesComponent implements OnInit {

  constructor(
    private db: DadosService
  ) {

    this.db.listarConvites().subscribe(querySnapshot => {
      console.log('querySnapshot: ', querySnapshot);

      let arrayAux = new Array<any>()

      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        arrayAux.push(doc.data())

        console.log('doc.data(): ', doc.data());

    })

    })

   }

  ngOnInit(): void {
  }



}
