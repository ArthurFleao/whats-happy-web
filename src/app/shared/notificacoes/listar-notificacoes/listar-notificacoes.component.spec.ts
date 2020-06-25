import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNotificacoesComponent } from './listar-notificacoes.component';

describe('ListarNotificacoesComponent', () => {
  let component: ListarNotificacoesComponent;
  let fixture: ComponentFixture<ListarNotificacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarNotificacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarNotificacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
