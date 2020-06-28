import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'art-button',
  templateUrl: './art-button.component.html',
  styleUrls: ['./art-button.component.scss']
})
export class ArtButtonComponent implements OnInit {
  @Input()
  type = 'button';
  @Input()
  color = 'primary';
  @Input()
  spin = false;
  @Input()
  disable = false;
  @Input()
  loading = false;
  @Input()
  addClass: string;
  @Input()
  overrideClass: string;

  @Input()
  noMargin = false;

  bclass = 'w-100';

  constructor() { }

  ngOnInit(): void {
    if (this.addClass) {
      this.bclass += ' ' + this.addClass;
    }
    if (this.overrideClass) {
      this.bclass = this.overrideClass;
    }

    if (!this.noMargin) {
      this.bclass += ' mt-1 mb-1';
    }
  }

}
