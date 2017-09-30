import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { IResponse, IPhoto, IUser, IFilters, IForeignKey, ILoginRequest } from 'app/model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiService {
  headers: HttpHeaders;

  constructor(
    private http: HttpClient) { }

  getPhotos(filters: IFilters): Observable<IResponse<IPhoto>> {
    let params = new HttpParams();
    for (const key of Object.keys(filters)) {
      if (filters[key] !== null) {
        params = params.append(key, filters[key]);
      }
    }
    return this.http.get<IResponse<IPhoto>>(`/api/photos/`, { params: params, headers: this.headers });
  }

  getPhotosFromIds(ids: string[]): Observable<IResponse<IPhoto>> {
    const params = new HttpParams().set('ids', ids.join());
    return this.http.get<IResponse<IPhoto>>(`/api/photos/list-from-ids`, { params, headers: this.headers });
  }

  getHomePagePhotos(filters: IFilters): Observable<IResponse<IPhoto>> {
    let params = new HttpParams();
    for (const key of Object.keys(filters)) {
      params = params.append(key, filters[key]);
    }
    params = params.append('on_home_page', 'true');
    return this.http.get<IResponse<IPhoto>>(`/api/photos/`, { params: params, headers: this.headers });
  }

  getSplashPhoto(): Observable<IPhoto> {
    return this.http.get<IPhoto>(`api/photos/latest-splash`);
  }

  getUsers(): Observable<IResponse<IUser>> {
    return this.http.get<IResponse<IUser>>(`/api/users/`, {headers: this.headers});
  }

  getAlbums() {
    return this.http.get<IForeignKey[]>(`api/albums/`, {headers: this.headers});
  }
  getCategories() {
    return this.http.get<IForeignKey[]>(`api/categories/`, {headers: this.headers});
  }
  getMediums() {
    return this.http.get<IForeignKey[]>(`api/mediums/`, {headers: this.headers});
  }
  getPlaces() {
    return this.http.get<IForeignKey[]>(`api/places/`, {headers: this.headers});
  }
  getSecurityLevels() {
    return this.http.get<IForeignKey[]>(`api/security-levels/`, {headers: this.headers});
  }

  postPhoto(formData, token) {
    return this.http.post(`/api/photos/`, formData, {
      reportProgress: true,
      headers: this.headers,
    });
  }

  updatePhoto(photo: IPhoto): Observable<any> {
    const formData = new FormData();
    for (const key of Object.keys(photo)) {
      formData.append(key, photo[key]);
    }
    return this.http.put(`/api/photos/${photo.id}/`, formData, {
      headers: this.headers,
    });
  }

  login(data: ILoginRequest): Observable<any> {
    return this.http.post(`api/token-auth/`, data);
  }
}
