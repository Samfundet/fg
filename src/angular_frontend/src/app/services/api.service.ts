import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import {
  IResponse, IPhoto, IUser, IOrder, IFilters, IForeignKey, ILoginRequest, ILoginResponse, IStatistics, ILatestImageAndPage
} from 'app/model';
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
        if (filters[key] !== null) {
          params = params.append(key, filters[key]);
        }
      }
    }
    params = params.append('on_home_page', 'true');
    return this.http.get<IResponse<IPhoto>>(`/api/photos/`, { params: params });
  }

  getSplashPhoto(): Observable<IPhoto> {
    return this.http.get<IPhoto>(`api/photos/latest-splash`);
  }

  getStatistics(): Observable<IStatistics> {
    return this.http.get<IStatistics>(`/api/statistics/`);
  }

  getUsers(): Observable<IResponse<IUser>> {
    return this.http.get<IResponse<IUser>>(`/api/users/`);
  }

  getFgUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`/api/users/fg`);
  }

  getPowerUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`/api/users/power`);
  }

  getForeignKey(type: string) {
    return this.http.get<IForeignKey[]>(`api/${type}/`);
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
  getOrders(type: string): Observable<IOrder[]> {
    let params = new HttpParams();
    switch (type) {
      case 'old':
        params = params.set('order_completed', 'true');
        return this.http.get<IOrder[]>(`api/orders/`, { params });
      case 'new':
        params = params.set('order_completed', 'false');
        return this.http.get<IOrder[]>(`api/orders/`, { params });
    }
  }

  getLatestPageAndImageNumber(albumID: number): Observable<ILatestImageAndPage> {
    return this.http.get<ILatestImageAndPage>(`api/photos/upload-info/${albumID}`);
  }

  toggleOrderCompleted(order: IOrder): Observable<IOrder> {
    return this.http.put<IOrder>(`api/orders/${order.id}/`, order);
  }

  postPhoto(formData) {
    return this.http.post(`/api/photos/`, formData);
  }

  updatePhoto(photo): Observable<any> {
    return this.http.patch(`/api/photos/${photo.id}/`, photo);
  }

  updateUser(user: IUser): Observable<any> {
    return this.http.put(`/api/users/${user.id}/`, user);
  }
  createUser(user: IUser): Observable<any> {
    return this.http.post(`/api/users/`, user);
  }
  deleteUser(user: IUser): Observable<any> {
    return this.http.delete(`/api/users/${user.id}/`);
  }


  updateForeignKey(fk: IForeignKey, type: string): Observable<any> {
    return this.http.put(`/api/${type}/${fk.id}/`, fk);
  }

  createForeignKey(fk: IForeignKey, type: string): Observable<any> {
    return this.http.post(`/api/${type}/`, fk);
  }

  deleteForeignKey(fk: IForeignKey, type: string): Observable<any> {
    return this.http.delete(`/api/${type}/${fk.id}/`);
  }

  order(order: IOrder) {
    return this.http.post(`api/orders/`, order);
  }


  login(encodedCredentials: string): Observable<ILoginResponse> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', encodedCredentials);
    return this.http.get<ILoginResponse>(`api/login/`, { headers });
  }

  refreshToken(current_token): Observable<any> {
    return this.http.post(`api/token-refresh/`, { token: current_token });
  }
}

