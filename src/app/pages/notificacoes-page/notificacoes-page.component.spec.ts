import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacoesPageComponent } from './notificacoes-page.component';

describe('NotificacoesPageComponent', () => {
  let component: NotificacoesPageComponent;
  let fixture: ComponentFixture<NotificacoesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacoesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacoesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
