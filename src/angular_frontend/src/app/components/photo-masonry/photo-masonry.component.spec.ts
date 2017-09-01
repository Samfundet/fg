import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoMasonryComponent } from './photo-masonry.component';

describe('PhotoMasonryComponent', () => {
  let component: PhotoMasonryComponent;
  let fixture: ComponentFixture<PhotoMasonryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoMasonryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoMasonryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
