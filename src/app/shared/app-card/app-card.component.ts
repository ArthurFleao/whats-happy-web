import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.scss']
})
export class AppCardComponent implements OnInit {
  @Input()
  title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
