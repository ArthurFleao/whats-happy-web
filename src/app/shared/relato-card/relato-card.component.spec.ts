import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoCardComponent } from './relato-card.component';

describe('RelatoCardComponent', () => {
  let component: RelatoCardComponent;
  let fixture: ComponentFixture<RelatoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
