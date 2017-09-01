import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { IResponse, IPhoto, IUser, IFilters } from 'app/model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient) { }

  public getPhotos(filters: IFilters): Observable<IResponse<IPhoto>> {
    return this.http.get<IResponse<IPhoto>>(`/api/photos/`, {
      params: new HttpParams().set('page', filters.page)
    });
  }

  public getUsers(): Observable<IResponse<IUser>> {
    return this.http.get<IResponse<IUser>>(`/api/users/`);
  }

  public uploadPhotos(formData) {
    return this.http.post(`/api/photos`, formData);
  }
}
