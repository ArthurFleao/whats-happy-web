import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarRelatoPageComponent } from './enviar-relato-page.component';

describe('EnviarRelatoPageComponent', () => {
  let component: EnviarRelatoPageComponent;
  let fixture: ComponentFixture<EnviarRelatoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviarRelatoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarRelatoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
