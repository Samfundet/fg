/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookFgComponent } from './book-fg.component';

describe('BookFgComponent', () => {
  let component: BookFgComponent;
  let fixture: ComponentFixture<BookFgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookFgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookFgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
