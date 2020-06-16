import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioPageComponent } from './relatorio-page.component';

describe('RelatorioPageComponent', () => {
  let component: RelatorioPageComponent;
  let fixture: ComponentFixture<RelatorioPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
