import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { IPhotoResponse } from '../components/gallery/gallery.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiService {
  private baseUrl = '/api';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: HttpClient) {
  }

  public getImages<IPhotoResponse>(): Observable<IPhotoResponse> {
    return this.http.get<IPhotoResponse>(`${this.baseUrl}/photos`);
  }

  // // GET
  // public getImages<T>(path: string): Observable<any> {
  //   return this.http<T>.get(`${this.baseUrl}/${path}`)
  //     .catch(this.httpCatcher)
  //     .map(this.extractData);
  // }

  // // POST
  // public postSubscribable(path: string, obj?: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/${path}`, obj, this.options)
  //     .catch(this.httpCatcher)
  //     .map(this.extractData);
  // }

  // // PUT
  // public putSubscribable(path: string, obj?: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${path}`, obj, this.options)
  //     .catch(this.httpCatcher)
  //     .map(this.extractData);
  // }

  // // DELETE
  // public deleteSubscribable(path: string): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/${path}`, this.options)
  //     .catch(this.httpCatcher)
  //     .map(this.extractData);
  // }

  // private httpCatcher(error: Response | any) {
  //   alert(error); //TODO
  //   return Observable.throw(error);
  // }

  // private extractData(res: Response) {
  //   return res.json();
  // }

}
