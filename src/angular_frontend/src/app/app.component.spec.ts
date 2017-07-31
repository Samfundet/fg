import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { NavComponent, FooterComponent } from 'app/components';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        NavComponent,
        FooterComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have a fg-nav component`, async(() => {
    const fixture = TestBed.createComponent(NavComponent);
    const nav = fixture.debugElement.componentInstance;
    expect(nav).toBeTruthy();
  }));

  it(`should have a fg-footer component`, async(() => {
    const fixture = TestBed.createComponent(FooterComponent);
    const footer = fixture.debugElement.componentInstance;
    expect(footer).toBeTruthy();
  }));
});
