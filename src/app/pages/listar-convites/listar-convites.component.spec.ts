import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConvitesComponent } from './listar-convites.component';

describe('ListarConvitesComponent', () => {
  let component: ListarConvitesComponent;
  let fixture: ComponentFixture<ListarConvitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarConvitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarConvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
