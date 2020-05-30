import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPacientesPageComponent } from './listar-pacientes-page.component';

describe('ListarPacientesPageComponent', () => {
  let component: ListarPacientesPageComponent;
  let fixture: ComponentFixture<ListarPacientesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPacientesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPacientesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
