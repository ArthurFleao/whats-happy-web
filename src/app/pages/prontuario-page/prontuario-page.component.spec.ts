import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProntuarioPageComponent } from './prontuario-page.component';

describe('ProntuarioPageComponent', () => {
  let component: ProntuarioPageComponent;
  let fixture: ComponentFixture<ProntuarioPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProntuarioPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProntuarioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
