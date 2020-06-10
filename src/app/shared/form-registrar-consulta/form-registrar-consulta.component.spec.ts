import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegistrarConsultaComponent } from './form-registrar-consulta.component';

describe('FormRegistrarConsultaComponent', () => {
  let component: FormRegistrarConsultaComponent;
  let fixture: ComponentFixture<FormRegistrarConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRegistrarConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRegistrarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
