import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(values) { // quando clicar no botão submit
    console.log(values);
  }

}
