import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtButtonComponent } from './art-button.component';

describe('ArtButtonComponent', () => {
  let component: ArtButtonComponent;
  let fixture: ComponentFixture<ArtButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
