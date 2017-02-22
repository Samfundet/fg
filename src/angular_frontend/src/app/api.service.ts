import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'; //TODO why no work?
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  private baseUrl = "/api";

  constructor(
    private http: Http
  ) { }

  public getUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
    /* TODO import map and catch properly
      .map(this.handleResponse)
      .catch(this.handleError)
      */
  }

  //TODO
  private handleResponse(res: Response | any): any {
    if (res !instanceof Response) {
      console.error("res is not Response! returning void");
      return;
    } else {
      console.log(res);
      return res.json();
    }
  }

  //TODO "HANDLE IT"
  private handleError(error: Response | any) {
    if (error instanceof Response) {
      console.error("Error is response");
      console.error(error);
    } else {
      console.error("Error is not a response");
      console.error(error);
    }
    return Observable.throw;
  }
}
