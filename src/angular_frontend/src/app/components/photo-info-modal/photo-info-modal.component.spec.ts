import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoInfoModalComponent } from './photo-info-modal.component';

describe('PhotoInfoModalComponent', () => {
  let component: PhotoInfoModalComponent;
  let fixture: ComponentFixture<PhotoInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
