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
    if (localStorage.getItem('username')) {
      return true;
    } else {
      this.store.showLoginModalAction(state.url);
      return false;
    }
  }
}
