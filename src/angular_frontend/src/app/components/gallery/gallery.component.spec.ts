import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { GalleryComponent } from './gallery.component';
import { IPhotoResponse, testData } from './gallery.model';
import { MasonryLayoutDirective } from 'app/directives';
import { ApiService } from 'app/services';

class MockApiService {
  getPhotos(): Observable<IPhotoResponse> {
    return Observable.of(testData);
  }
}

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let mockApiService;

  beforeEach(async(() => {
    mockApiService = new MockApiService();
    TestBed.configureTestingModule({
      declarations: [
        GalleryComponent,
        MasonryLayoutDirective
      ],
      providers: [{ provide: ApiService, useValue: mockApiService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
