import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StoreService } from 'app/services/store.service';
import { Observable } from 'rxjs/Observable';
import * as JwtDecode from 'jwt-decode';
import { IToken } from 'app/model';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private store: StoreService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('csrf_token');
    if (token) {
      if (this.tokenExpired(token)) {
        localStorage.removeItem('csrf_token');
        localStorage.removeItem('username');
        this.store.showLoginModalAction(state.url);
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  tokenExpired(t) {
    const token: IToken = <IToken>JwtDecode(t);
    console.log(token);
    const now = new Date().getTime() / 1000;
    if (token.exp <= now) {
      return true;
    }
    return false;
  }

}
