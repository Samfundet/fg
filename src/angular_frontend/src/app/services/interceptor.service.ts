import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { StoreService } from 'app/services/store.service';

@Injectable()
export class OutAuthInterceptor implements HttpInterceptor {
  constructor(private inj: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const store = this.inj.get(StoreService);

    const authHeader = localStorage.getItem('Authorization');
    if (authHeader) {
      const authReq = req.clone({ setHeaders: { Authorization: authHeader } });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
