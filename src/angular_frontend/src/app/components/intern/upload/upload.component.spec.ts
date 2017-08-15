import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from 'app/services';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UploadComponent } from './upload.component';

class MockApiService {
  uploadPhotos(formData) {
    return Observable.of(null);
  }
}

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  const mockApiService = new MockApiService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadComponent ],
      providers: [{ provide: ApiService, useValue: mockApiService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
