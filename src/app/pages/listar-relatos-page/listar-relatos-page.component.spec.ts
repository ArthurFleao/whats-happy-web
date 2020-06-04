import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRelatosPageComponent } from './listar-relatos-page.component';

describe('ListarRelatosPageComponent', () => {
  let component: ListarRelatosPageComponent;
  let fixture: ComponentFixture<ListarRelatosPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarRelatosPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarRelatosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
