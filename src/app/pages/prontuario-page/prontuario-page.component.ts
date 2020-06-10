import { Component, OnInit } from '@angular/core';
import { DadosService } from 'src/app/services/dados.service';
import { ErrorHandlerService } from './../../services/error-handler.service';

@Component({
  selector: 'app-prontuario-page',
  templateUrl: './prontuario-page.component.html',
  styleUrls: ['./prontuario-page.component.scss']
})
export class ProntuarioPageComponent implements OnInit {

  arrayFichasCadastro: Array<any>

  constructor(
    private dadosService: DadosService,
    private eh: ErrorHandlerService
  ) {

  }

  ngOnInit(): void {

    this.dadosService.getProntuario("jrt53XFGVDVvf2Y3biMU1KYMZom1").subscribe(querySnapshot => {

      let arrayAux = new Array<any>()

      querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          arrayAux.push(doc.data())
          console.log(doc.id, " => ", doc.data());
      })

      this.arrayFichasCadastro = arrayAux

    }, error => {
    this.eh.handle(error)
    });

  }

}
