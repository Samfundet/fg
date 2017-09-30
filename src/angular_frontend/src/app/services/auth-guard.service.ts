import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StoreService } from 'app/services';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';



@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private store: StoreService) { }

  canActivate(): Observable<boolean> {
    if (this.store.token) {
      return Observable.of(true);
    } else {
      this.store.showLoginModalAction();
    }
    // get csrf-token

    // store csrf-token in store
    return Observable.of(false);
  }

}
