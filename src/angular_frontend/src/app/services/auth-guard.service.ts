import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StoreService } from 'app/services/store.service';
import { Observable } from 'rxjs/Observable';
import * as JwtDecode from 'jwt-decode';
import 'rxjs/add/observable/of';



@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private store: StoreService) { }

  canActivate(): boolean {
    const token = localStorage.getItem('csrf_token');
    if (token) {
      if (this.tokenExpired(token)) {
        localStorage.removeItem('csrf_token');
        this.store.showLoginModalAction();
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  tokenExpired(token) {
    const exp = JwtDecode(token);
    console.log(exp);
    return false; // TODO
  }

}
