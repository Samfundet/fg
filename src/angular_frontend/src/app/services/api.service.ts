import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { IPhotoResponse } from '../components/gallery/gallery.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { StoreService } from 'app/services';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiService {
  private baseUrl = '/api';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: HttpClient,
    private store: StoreService
  ) {
  }

  public getPhotos(page?: number): Observable<IPhotoResponse> {
    const query = page ? `?page=${page}` : '';
    return this.http.get<IPhotoResponse>(`${this.baseUrl}/photos${query}`);
  }

  /* Generic retrieval of object and storage into store */
  public getObjectToStore<T>(url: string, subject: Subject<T>): void {
    this.http.get<T>(`${url}`).subscribe(x => {
      subject.next(x);
    });
  }

  public uploadPhotos(formData) {
    return this.http.post(`${this.baseUrl}/photos`, formData);
  }
}
