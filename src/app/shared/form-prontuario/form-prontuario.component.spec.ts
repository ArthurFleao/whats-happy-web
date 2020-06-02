import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProntuarioComponent } from './form-prontuario.component';

describe('FormProntuarioComponent', () => {
  let component: FormProntuarioComponent;
  let fixture: ComponentFixture<FormProntuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProntuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProntuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
