import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPsicologoComponent } from './form-psicologo.component';

describe('FormPsicologoComponent', () => {
  let component: FormPsicologoComponent;
  let fixture: ComponentFixture<FormPsicologoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPsicologoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPsicologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
