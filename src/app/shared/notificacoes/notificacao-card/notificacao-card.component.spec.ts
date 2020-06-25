import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacaoCardComponent } from './notificacao-card.component';

describe('NotificacaoDevedorSemTipoNegocioComponent', () => {
  let component: NotificacaoCardComponent;
  let fixture: ComponentFixture<NotificacaoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacaoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacaoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
