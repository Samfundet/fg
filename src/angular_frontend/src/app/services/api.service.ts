import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { IResponse, IPhoto, IUser, IOrder, IFilters, IForeignKey, ILoginRequest } from 'app/model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }

  getPhotos(filters: IFilters): Observable<IResponse<IPhoto>> {
    let params = new HttpParams();
    if (filters) {
      for (const key of Object.keys(filters)) {
        if (filters[key] !== null && filters[key] !== '') {
          params = params.append(key, filters[key]);
        }
      }
    }
    return this.http.get<IResponse<IPhoto>>(`/api/photos/`, { params: params });
  }

  getPhotosFromIds(ids: string[]): Observable<IResponse<IPhoto>> {
    const params = new HttpParams().set('ids', ids.join());
    return this.http.get<IResponse<IPhoto>>(`/api/photos/list-from-ids`, { params });
  }

  getHomePagePhotos(filters: IFilters): Observable<IResponse<IPhoto>> {
    let params = new HttpParams();
    if (filters) {
      for (const key of Object.keys(filters)) {
        params = params.append(key, filters[key]);
      }
    }
    params = params.append('on_home_page', 'true');
    return this.http.get<IResponse<IPhoto>>(`/api/photos/`, { params: params });
  }

  getSplashPhoto(): Observable<IPhoto> {
    return this.http.get<IPhoto>(`api/photos/latest-splash`);
  }

  getUsers(): Observable<IResponse<IUser>> {
    return this.http.get<IResponse<IUser>>(`/api/users/`);
  }

  getAlbums() {
    return this.http.get<IForeignKey[]>(`api/albums/`);
  }
  getCategories() {
    return this.http.get<IForeignKey[]>(`api/categories/`);
  }
  getMediums() {
    return this.http.get<IForeignKey[]>(`api/mediums/`);
  }
  getPlaces() {
    return this.http.get<IForeignKey[]>(`api/places/`);
  }
  getSecurityLevels() {
    return this.http.get<IForeignKey[]>(`api/security-levels/`);
  }

  postPhoto(formData) {
    return this.http.post(`/api/photos/`, formData);
  }

  updatePhoto(photo: IPhoto): Observable<any> {
    const formData = new FormData();
    for (const key of Object.keys(photo)) {
      formData.append(key, photo[key]);
    }
    return this.http.put(`/api/photos/${photo.id}/`, formData);
  }

  order(order: IOrder) {
    return this.http.post(`api/orders/`, order);
  }

  loginHusfolk(data: ILoginRequest): Observable<any> {
    return this.http.post(`api/login-husfolk/`, data);
  }

  loginPowerbruker(data: ILoginRequest): Observable<any> {
    return this.http.post(`api/login-powerbruker/`, data);
  }

  refreshToken(current_token): Observable<any> {
    return this.http.post(`api/token-refresh/`, { token: current_token });
  }
}
