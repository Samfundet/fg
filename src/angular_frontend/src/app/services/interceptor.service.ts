import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { StoreService } from 'app/services/store.service';
import { IToken } from 'app/model';
import { DELTA } from 'app/config';
import * as JwtDecode from 'jwt-decode';

enum TOKEN_STATUS {
  ABOUT_TO_EXPIRE,
  EXPIRED,
  NO_TOKEN
}

@Injectable()
export class OutAuthInterceptor implements HttpInterceptor {
  constructor(private inj: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const store = this.inj.get(StoreService);

    switch (this.getTokenStatus(localStorage.getItem('csrf_token'))) {
      case TOKEN_STATUS.NO_TOKEN:
        store.logoutAction();
        break;
      case TOKEN_STATUS.ABOUT_TO_EXPIRE:
        store.refreshTokenAction();
        break;
      case TOKEN_STATUS.EXPIRED:
        store.showLoginModalAction();
        break;
    }

    const authHeader = this.getAuthorizationHeader();
    if (authHeader) {
      const authReq = req.clone({ setHeaders: { Authorization: authHeader } });
      return next.handle(authReq);
    }

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

  // THEN > TOKEN10 > NOW05

  getTokenStatus(t): TOKEN_STATUS  {
    const delta = DELTA;
    const token: IToken = t !== 'undefined' && t ? <IToken>JwtDecode(t) : null;
    const now = new Date().getTime() / 1000;
    if (!token) {
      return TOKEN_STATUS.NO_TOKEN;
    } else if (token.exp < (now + delta) && token.exp > now) {
      return TOKEN_STATUS.ABOUT_TO_EXPIRE;
    } else {
      return TOKEN_STATUS.EXPIRED;
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
