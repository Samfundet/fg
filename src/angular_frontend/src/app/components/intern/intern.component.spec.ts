import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { InternComponent } from './intern.component';

describe('InternComponent', () => {
  let component: InternComponent;
  let fixture: ComponentFixture<InternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InternComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
