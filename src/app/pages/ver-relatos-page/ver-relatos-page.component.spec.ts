import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRelatosPageComponent } from './ver-relatos-page.component';

describe('VerRelatosPageComponent', () => {
  let component: VerRelatosPageComponent;
  let fixture: ComponentFixture<VerRelatosPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerRelatosPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerRelatosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
