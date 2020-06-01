import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConvidarPacienteComponent } from './form-convidar-paciente.component';

describe('FormConvidarPacienteComponent', () => {
  let component: FormConvidarPacienteComponent;
  let fixture: ComponentFixture<FormConvidarPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormConvidarPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConvidarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
