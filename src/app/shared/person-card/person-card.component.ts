import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model/user';
import * as moment from 'moment';
@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input()
  person: User;

  @Input()
  grayIt: boolean;
  constructor() { }

  ngOnInit(): void {
    console.log('person in personcard', this.person);

  }

}
