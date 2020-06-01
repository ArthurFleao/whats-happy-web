import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvidarPacientePageComponent } from './convidar-paciente-page.component';

describe('ConvidarPacientePageComponent', () => {
  let component: ConvidarPacientePageComponent;
  let fixture: ComponentFixture<ConvidarPacientePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvidarPacientePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvidarPacientePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
