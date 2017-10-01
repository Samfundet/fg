import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { StoreService } from 'app/services/store.service';

@Injectable()
export class OutAuthInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    const authHeader = this.getAuthorizationHeader();
    // Clone the request to add the new header.
    if (authHeader) {
      const authReq = req.clone({ setHeaders: { Authorization: authHeader } });
      return next.handle(authReq);
    }

    // No operation
    return next.handle(req);
  }

  getAuthorizationHeader() {
    const token = localStorage.getItem('csrf_token');
    if (token) {
      return 'FG_JWT ' + token;
    } else {
      return null;
    }
  }
}

// @Injectable()
// export class InAuthInterceptor implements HttpInterceptor {
//   constructor() {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return null; // TODO
//   }
// }
