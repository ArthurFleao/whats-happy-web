import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-box',
  templateUrl: './test-box.component.html',
  styleUrls: ['./test-box.component.scss']
})
export class TestBoxComponent implements OnInit {
  showTest = environment.enableTests; // olha o arquivo environment, que é usado no build, para ver se pode mostrar os testes
  // quando rodado em produção, o environment não permite mostrar testes.
  constructor() { }

  ngOnInit(): void {
  }

}
