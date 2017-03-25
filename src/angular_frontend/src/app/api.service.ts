import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  private baseUrl = "/api";

  constructor(
    private http: Http
  ) { }

  public get(endPoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endPoint}`)
      .catch(this.handleError)
      .map(this.handleResponse)
  }

  private handleResponse(res: Response): any {
    if (res.hasOwnProperty("ok")) {
      if (res.ok) {
        return res.json();
      }
    } else {
      console.error("Response not ok!")
    }
  }

  private handleError(error) {
    if (error.hasOwnProperty("ok")) {
      if(!error.ok) {
        console.error("Error: " + error.status);
        return new Observable<any>(error);
      }
    }
  }
}
