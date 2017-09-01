import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricepointsComponent } from './pricepoints.component';

describe('PricepointsComponent', () => {
  let component: PricepointsComponent;
  let fixture: ComponentFixture<PricepointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricepointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricepointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
