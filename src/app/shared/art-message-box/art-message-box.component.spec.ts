import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtMessageBoxComponent } from './art-message-box.component';

describe('ArtMessageBoxComponent', () => {
  let component: ArtMessageBoxComponent;
  let fixture: ComponentFixture<ArtMessageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtMessageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
