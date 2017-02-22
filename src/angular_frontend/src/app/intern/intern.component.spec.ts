/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InternComponent } from './intern.component';

describe('InternComponent', () => {
  let component: InternComponent;
  let fixture: ComponentFixture<InternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
