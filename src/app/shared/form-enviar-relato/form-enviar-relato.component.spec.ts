import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEnviarRelatoComponent } from './form-enviar-relato.component';

describe('FormEnviarRelatoComponent', () => {
  let component: FormEnviarRelatoComponent;
  let fixture: ComponentFixture<FormEnviarRelatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEnviarRelatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEnviarRelatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
