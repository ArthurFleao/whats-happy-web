import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarConsultaPageComponent } from './registrar-consulta-page.component';

describe('RegistrarConsultaPageComponent', () => {
  let component: RegistrarConsultaPageComponent;
  let fixture: ComponentFixture<RegistrarConsultaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarConsultaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarConsultaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
