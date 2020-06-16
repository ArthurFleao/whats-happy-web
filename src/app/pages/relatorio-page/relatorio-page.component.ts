import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-relatorio-page',
  templateUrl: './relatorio-page.component.html',
  styleUrls: ['./relatorio-page.component.css']
})
export class RelatorioPageComponent implements OnInit {

  paramName;
  height;
  url = 'https://datastudio.google.com/embed/reporting/81ac474b-10bc-4297-9cd7-47202f251ba9/page/oGUTB';
  iframeUrl;

  constructor(
              private sanitizer: DomSanitizer,
              private router: Router,
              private auth: AuthService,
  ) {
    this.height = window.innerHeight - 125;
    this.auth.user$.subscribe(res => {
      const uid = encodeURIComponent(res.uid);
      this.paramName = `?params=%7B%22df6%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${uid}%22%7D`;
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url + this.paramName);

    }, error => {
      console.error(error);
    });
  }

  ngOnInit(): void {


  }

}
