import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  test() {
    console.log('trying');
    this.auth.testRegister()({ test: 'wtf' }).subscribe(res => {
      console.log(res);
    }, error => {
      console.error(error);
    });
  }

}
