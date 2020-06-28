import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConvitesPageComponent } from './listar-convites-page.component';

describe('ListarConvitesPageComponent', () => {
  let component: ListarConvitesPageComponent;
  let fixture: ComponentFixture<ListarConvitesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarConvitesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarConvitesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
