import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiService {
  private baseUrl = '/api';
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http) {
  }

  // GET
  public getSubscribable(path: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${path}`)
      .catch(this.httpCatcher)
      .map(this.extractData);
  }

  // POST
  public postSubscribable(path: string, obj?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${path}`, obj, this.options)
      .catch(this.httpCatcher)
      .map(this.extractData);
  }

  // PUT
  public putSubscribable(path: string, obj?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${path}`, obj, this.options)
      .catch(this.httpCatcher)
      .map(this.extractData);
  }

  // DELETE
  public deleteSubscribable(path: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${path}`, this.options)
      .catch(this.httpCatcher)
      .map(this.extractData);
  }


  private httpCatcher(error: Response | any) {
    alert(error); //TODO
    return Observable.throw(error);
  }

  private extractData(res: Response) {
    return res.json();
  }

}
