import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacoesPopoverComponent } from './notificacoes-popover.component';

describe('NotificacoesPopoverComponent', () => {
  let component: NotificacoesPopoverComponent;
  let fixture: ComponentFixture<NotificacoesPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacoesPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacoesPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
