import { Injectable } from '@angular/core';
import { Router, ParamMap } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'app/services/api.service';
import {
  IResponse, IPhoto, IUser, IFilters, ILoginRequest, IForeignKey, IOrder, IStatistics, ILatestImageAndPage
} from 'app/model';
import { DELTA } from 'app/config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import { ToastrService } from 'ngx-toastr';

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
  private _photoShoppingCart$ = new BehaviorSubject<IPhoto[]>(null);
  private _searchTags$ = new BehaviorSubject<IForeignKey[]>(null);

  public photoRouteActive$ = new Subject<boolean>();
  public photoModal$ = new BehaviorSubject<IPhoto>(null);

  public foreignKeys$: { [type: string]: BehaviorSubject<IForeignKey[]>; } = {};
  public fgUsers$ = new BehaviorSubject<IUser[]>(null);
  public powerUsers$ = new BehaviorSubject<IUser[]>(null);

  public latestPageAndImageNumber = new BehaviorSubject<ILatestImageAndPage>(null);

  public orders$: { [type: string]: BehaviorSubject<IOrder[]>; } = {};



  private returnUrl;

  constructor(private api: ApiService, private router: Router, private toastr: ToastrService) {
    this._filters$.subscribe(filters => {
      this.router.navigate([], {
        queryParams: filters
      });
    });

    this.foreignKeys$['albums'] = new BehaviorSubject<IForeignKey[]>(null);
    this.foreignKeys$['categories'] = new BehaviorSubject<IForeignKey[]>(null);
    this.foreignKeys$['mediums'] = new BehaviorSubject<IForeignKey[]>(null);
    this.foreignKeys$['places'] = new BehaviorSubject<IForeignKey[]>(null);

    this.orders$['new'] = new BehaviorSubject<IOrder[]>([]);
    this.orders$['old'] = new BehaviorSubject<IOrder[]>([]);

    // get photos that are in localStorage and add to photoShoppingCart
    this._photoShoppingCart$.next(JSON.parse(localStorage.getItem('photoShoppingCart')));
    this._photoShoppingCart$.skip(1).subscribe(c => localStorage.setItem('photoShoppingCart', JSON.stringify(c)));
  }

  // Actions that can be dispatched (Must end with Action)
  setFiltersAction(filters: IFilters) {
    this._filters$.next(filters);
  }

  setSearchTagsAction(tag: IForeignKey): void {
    const tags = this.getSearchTagsValue();
    if (tags.find(p => p.id === tag.id)) {
      return;
    }
    tags.push(tag);
    this._searchTags$.next(tags);
  }

  removeSearchTagAction(tag: IForeignKey): void {
    const tags = this.getSearchTagsValue();
    if (!tags.find(p => p.id === tag.id)) {
      return;
    }
    tags.splice(tags.indexOf(tag), 1);
    this._searchTags$.next(tags);
  }

  getSearchTagsAction(): Observable<IForeignKey[]> {
    return this._searchTags$.asObservable();
  }

  getHomePagePhotosAction(params: ParamMap) {
    const filter: IFilters = params.get('cursor') ? { cursor: params.get('cursor') } : null;
    this.api.getHomePagePhotos(filter).subscribe(
      pr => this._photos$.next(pr),
      err => this.toastr.error('Feil', JSON.parse(err.error).detail)
    );
    this.setFiltersAction(filter);
  }

  getMoreHomePagePhotosAction() {
    if (this._photos$.getValue() && this._photos$.getValue().next) {
      const filters = { cursor: this.getQueryParamValue(this._photos$.getValue().next, 'cursor') };
      this.setFiltersAction(filters);
      const currentPhotoList = this._photos$.getValue().results;
      this.api.getPhotos(filters).subscribe(pr => {
        pr.results = currentPhotoList.concat(pr.results);
        this._photos$.next(pr);
      }, err => this.toastr.error('Feil', JSON.parse(err.error).detail));
    } else {
      this.toastr.warning('Ingen flere bilder');
    }
  }

  // TODO - get methods for albums/categories/mediums/places/securitylevels
  // So we don't have to go through api every single time we have to use them???

  getStatisticsAction(): Observable<IStatistics> {
    return this.api.getStatistics();
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

  loginAction(data: ILoginRequest) {
    const encodedCredentials = 'Basic ' + btoa(`${data.username}:${data.password}`);
    this.api.login(encodedCredentials).subscribe(res => {
      this.storeEncodedCredentials(res.username, res.groups, encodedCredentials);
      /*
      navigation after login based on group
      TODO?: make this more dynamic instead of hardcoding routes here.
      */
      if (res.groups.indexOf('FG') !== -1) {
        this.router.navigateByUrl('/intern/opplasting');
      } else if (res.groups.indexOf('POWER') !== -1 || res.groups.indexOf('HUSFOLK') !== -1) {
        this.router.navigateByUrl('/intern/søk');
      }
      this._loginModal$.next(null);
      this.toastr.success(`Velkommen ${res.username} 😊`);
    }, err => {
      this._loginModal$.next({ username: null, password: null, hasFailed: true });
    });
  }


  logoutAction() {
    this.toastr.info(null, `På gjensyn ${localStorage.getItem('username')}! 👋`);
    // removes localstorage
    localStorage.removeItem('Authorization');
    localStorage.removeItem('username');
    localStorage.removeItem('groups');
    this.router.navigateByUrl('/'); // navigates back to root
  }

  getUsernameAction() {
    return localStorage.getItem('username');
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

  getFilteredAlbumsAction(type: string) {
    const albums: IForeignKey[] = [];
    this.api.getAlbums().subscribe(a => {
      a.forEach(e => {
        if (e['name'].substring(0, 3) === type) {
          albums.push(e);
        }
      });
    });
    return albums;
  }

  getAnalogNotScannedIdsAction(album: string, page: string, image_numbers: string[]) {
    return this.api.getPhotosFromAlbumPageAndNumber(album, page, image_numbers);
  }

  postAnalogPhotoAction() {
    return null;
  }

  postPhotoAction(data) {
    const formData = new FormData();
    for (const key of Object.keys(data)) {
      if (key === 'tags') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
    return this.api.postPhoto(formData);
  }

  getOrdersAction(type: string) {
    this.api.getOrders(type).subscribe(o => this.orders$[type].next(o));
    return this.orders$[type].asObservable();
  }

  toggleOrderCompletedAction(order: IOrder, type: string) {
    return this.api.toggleOrderCompleted(order).subscribe(() => this.getOrdersAction(type));
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

  getSearchTagsValue(): IForeignKey[] {
    return this._searchTags$.getValue() || [];
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

  private storeEncodedCredentials(username: string, groups: string[], encodedCredentials: string) {
    localStorage.setItem('Authorization', encodedCredentials);
    localStorage.setItem('username', username);
    localStorage.setItem('groups', JSON.stringify(groups));
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
