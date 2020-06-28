import { ConvitesService } from 'src/app/services/convites.service';
import { Component, OnInit } from '@angular/core';
import { DadosService } from 'src/app/services/dados.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-listar-convites-page',
  templateUrl: './listar-convites-page.component.html',
  styleUrls: ['./listar-convites-page.component.scss']
})
export class ListarConvitesPageComponent implements OnInit {

  myUid: string;
  convites: Array<any>;
  loading = true;

  constructor(
    private db: DadosService,
    private convitesService: ConvitesService,
    private authService: AuthService,
  ) {

    this.authService.me().then(res => {
      this.myUid = res.uid;

      this.convitesService.listarConvites(this.myUid).subscribe(convites => {
        this.convites = convites;
        this.loading = false;
        console.log(this.convites);

      });
    });

  }

  ngOnInit(): void {
  }



}
