import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { IResponse, IPhoto, IUser } from 'app/model';
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
  ) {}

  public getPhotos(page?: number): Observable<IResponse<IPhoto>> {
    const query = page ? `?page=${page}` : '';
    return this.http.get<IResponse<IPhoto>>(`${this.baseUrl}/photos/${query}`);
  }

  public getUsers(): Observable<IResponse<IUser>> {
    return this.http.get<IResponse<IUser>>(`${this.baseUrl}/users/`);
  }

  public uploadPhotos(formData) {
    return this.http.post(`${this.baseUrl}/photos`, formData);
  }
}
