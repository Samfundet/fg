import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'app/services/api.service';
import { IResponse, IPhoto, IUser, IFilters, ILoginRequest, IForeignKey, IOrder } from 'app/model';
import { DELTA } from 'app/config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';

interface IForeignKeyModal {
  fk: IForeignKey;
  type: string;
}

@Injectable()
export class StoreService {
  // The state of the application
  private _photos$ = new BehaviorSubject<IResponse<IPhoto>>(null);
  private _filters$ = new Subject<IFilters>();
  private _loginModal$ = new BehaviorSubject<ILoginRequest>(null);
  private _userModal$ = new BehaviorSubject<IUser>(null);
  private _foreignKeyModal$ = new BehaviorSubject<IForeignKeyModal>(null);
  private _refreshToken$ = new Subject<any>();
  private _photoShoppingCart$ = new BehaviorSubject<IPhoto[]>([]);

  public photoRouteActive$ = new Subject<boolean>();
  public photoModal$ = new BehaviorSubject<IPhoto>(null);

  public foreignKeys$: { [type: string]: BehaviorSubject<IForeignKey[]>; } = {};
  public fgUsers$ = new BehaviorSubject<IUser[]>(null);
  public powerUsers$ = new BehaviorSubject<IUser[]>(null);

  public orders$ = new BehaviorSubject<IOrder[]>([]);


  // TODO
  private returnUrl;

  constructor(private api: ApiService, private router: Router) {
    this._filters$.subscribe(f => {
      api.getHomePagePhotos(f).subscribe(pr => this.storePhotos(pr));
    });

    this._refreshToken$.debounceTime(1000).subscribe(t => {
      api.refreshToken(t).subscribe(new_token => this.storeToken(new_token));
    });

    this.foreignKeys$['albums'] = new BehaviorSubject<IForeignKey[]>(null);
    this.foreignKeys$['categories'] = new BehaviorSubject<IForeignKey[]>(null);
    this.foreignKeys$['mediums'] = new BehaviorSubject<IForeignKey[]>(null);
    this.foreignKeys$['places'] = new BehaviorSubject<IForeignKey[]>(null);


    // get photos that are in localStorage and add to photoShoppingCart
    this._photoShoppingCart$.next(JSON.parse(localStorage.getItem('photoShoppingCart')));
    this._photoShoppingCart$.skip(1).subscribe(c => localStorage.setItem('photoShoppingCart', JSON.stringify(c)));
  }

  // Actions that can be dispatched (Must end with Action)
  setFiltersAction(filters: IFilters) {
    this._filters$.next(filters);
  }

  getMorePhotosAction(): IFilters {
    if (this._photos$.getValue() && this._photos$.getValue().next) {
      const filters = { cursor: this.getQueryParamValue(this._photos$.getValue().next, 'cursor') };
      if (filters) {
        this.setFiltersAction(filters);
        return filters;
      }
    }
  }

  getSplashPhotoAction(): Observable<IPhoto> {
    return this.api.getSplashPhoto();
  }

  addPhotoToCartAction(photo: IPhoto): void {
    const cart = this.getPhotoShoppingCartValue();
    photo.addedToCart = true;
    if (cart.find(p => p.id === photo.id)) {
      return;
    }
    cart.push(photo);
    this._photoShoppingCart$.next(cart);
  }

  removePhotoFromCartAction(photo: IPhoto): void {
    photo.addedToCart = false;
    const cart = this.getPhotoShoppingCartValue();
    cart.splice(cart.indexOf(photo), 1);
    this._photoShoppingCart$.next(cart);
  }

  showLoginModalAction(returnUrl?) {
    this._loginModal$.next({ username: '', password: '' });
    this.returnUrl = returnUrl;
  }

  showUserModalAction(user: IUser) {
    this._userModal$.next(user);
  }

  showForeignKeyModalAction(fk: IForeignKey, type: string) {
    this._foreignKeyModal$.next({ fk, type });
  }

  updateFgUserAction(user: IUser) {
    return this.api.updateUser(user).subscribe(() => this.getFgUsersAction());
  }
  createFgUserAction(user: IUser) {
    return this.api.createUser(user).subscribe(() => this.getFgUsersAction());
  }
  deleteFgUserAction(user: IUser) {
    return this.api.deleteUser(user).subscribe(() => this.getFgUsersAction());
  }

  updatePowerUserAction(user: IUser) {
    return this.api.updateUser(user).subscribe(() => this.getPowerUsersAction());
  }
  createPowerUserAction(user: IUser) {
    return this.api.createUser(user).subscribe(() => this.getPowerUsersAction());
  }
  deletePowerUserAction(user: IUser) {
    return this.api.deleteUser(user).subscribe(() => this.getPowerUsersAction());
  }

  updateForeignKeyAction(fk: IForeignKey, type: string) {
    return this.api.updateForeignKey(fk, type).subscribe(() => this.getForeignKeyAction(type));
  }

  createForeignKeyAction(fk: IForeignKey, type: string) {
    return this.api.createForeignKey(fk, type).subscribe(() => this.getForeignKeyAction(type));
  }

  deleteForeignKeyAction(fk: IForeignKey, type: string) {
    return this.api.deleteForeignKey(fk, type).subscribe(() => this.getForeignKeyAction(type));
  }

  loginHusfolkAction(data: ILoginRequest) {
    this.api.loginHusfolk(data).subscribe(t => {
      // this.storeToken(t, data.username);
      console.log(this.returnUrl);
      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }

  loginPowerbrukerAction(data: ILoginRequest) {
    this.api.loginPowerbruker(data).subscribe(t => {
      // this.storeToken(t, data.username);
      console.log(this.returnUrl);
      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }

  logoutAction() {
    // localStorage.removeItem('csrf_token'); TODO
    // localStorage.removeItem('username');
  }

  getUsernameAction() {
    // return localStorage.getItem('username'); TODO
  }

  refreshTokenAction() {
    this._refreshToken$.next(localStorage.getItem('csrf_token'));
    console.log('Token refreshed');
  }

  getFgUsersAction() {
    this.api.getFgUsers().subscribe(u => this.fgUsers$.next(u));
    return this.fgUsers$.asObservable();
  }

  getPowerUsersAction() {
    this.api.getPowerUsers().subscribe(u => this.powerUsers$.next(u));
    return this.powerUsers$.asObservable();
  }

  getForeignKeyAction(type: string) {
    this.api.getForeignKey(type).subscribe(a => this.foreignKeys$[type].next(a));
    return this.foreignKeys$[type].asObservable();
  }

  postPhotoAction(data) {
    const formData = new FormData();
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }
    return this.api.postPhoto(formData);
  }

  getOrdersAction() {
    this.api.getOrders().subscribe(o => this.orders$.next(o));
    return this.orders$.asObservable();
  }

  finishOrder(order: IOrder) {
    return this.api.finishOrder(order);
  }

  // getters for observables of the datastreams
  get filters$() {
    return this._filters$.asObservable();
  }
  get photos$() {
    return this._photos$.asObservable();
  }

  get loginModal$(): Observable<ILoginRequest> {
    return this._loginModal$.asObservable();
  }

  get userModal$(): Observable<IUser> {
    return this._userModal$.asObservable();
  }

  get foreignKeyModal$(): Observable<IForeignKeyModal> {
    return this._foreignKeyModal$.asObservable();
  }

  get photoShoppingCart$(): Observable<IPhoto[]> {
    return this._photoShoppingCart$.asObservable();
  }

  getPhotoShoppingCartValue(): IPhoto[] {
    return this._photoShoppingCart$.getValue() || [];
  }

  // Private methods
  private storePhotos(photos: IResponse<IPhoto>) {
    const r = photos;
    if (this._photos$.getValue()) {
      // We already have photos, lets add the new photos to our list
      const oldPhotoResultList = this._photos$.getValue().results;
      r.results = oldPhotoResultList.concat(photos.results);
    }
    this._photos$.next(r);
  }

  private storeToken(t, username?) {
    localStorage.setItem('csrf_token', t.token);
    if (username) {
      localStorage.setItem('username', username);
    }
  }

  private getQueryParamValue(url: string, param: string): string {
    const vars = url.split('?')[1].split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === param) {
        return pair[1];
      }
    }
  }
}
