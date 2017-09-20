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

  getPhotos(filters: IFilters): Observable<IResponse<IPhoto>> {
    let params = new HttpParams();
    if (filters.page) {
      params = params.append('page', filters.page);
    }
    if (filters.search) {
      params = params.append('search', filters.search);
    }
    return this.http.get<IResponse<IPhoto>>(`/api/photos/`, {params: params});
  }

  getSplashPhoto(): Observable<IPhoto> {
    return this.http.get<IPhoto>(`api/photos/latest-splash`);
  }

  getUsers(): Observable<IResponse<IUser>> {
    return this.http.get<IResponse<IUser>>(`/api/users/`);
  }

  uploadPhotos(formData) {
    return this.http.post(`/api/photos`, formData);
  }
}
