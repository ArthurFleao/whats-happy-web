import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConviteCardComponent } from './convite-card.component';

describe('ConviteCardComponent', () => {
  let component: ConviteCardComponent;
  let fixture: ComponentFixture<ConviteCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConviteCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConviteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
