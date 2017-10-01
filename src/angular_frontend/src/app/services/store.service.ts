import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'app/services/api.service';
import { IResponse, IPhoto, IFilters, ILoginRequest } from 'app/model';

@Injectable()
export class StoreService {
  // The state of the application
  private _photos$ = new BehaviorSubject<IResponse<IPhoto>>(null);
  private _filters$ = new Subject<IFilters>();
  private _loginModal$ = new BehaviorSubject<ILoginRequest>(null);
  public photoRouteActive$ = new Subject<boolean>();
  public photoShoppingCart$ = new BehaviorSubject<IPhoto[]>([]);
  public photoModal$ = new BehaviorSubject<IPhoto>(null);

  constructor(private api: ApiService) {
    this._filters$.subscribe(f => {
      api.getHomePagePhotos(f).subscribe(pr => this.storePhotos(pr));
    });
  }

  // Actions that can be dispatched (Must end with Action)
  setFiltersAction(filters: IFilters) {
    this._filters$.next(filters);
  }

  getMorePhotosAction(): IFilters {
    if (this._photos$.getValue() && this._photos$.getValue().next) {
      const filters = { page: this._photos$.getValue().next.split('?page=')[1] };
      if (filters) {
        this.setFiltersAction(filters);
        return filters;
      }
      return null;
    }
  }

  getSplashPhotoAction(): Observable<IPhoto> {
    return this.api.getSplashPhoto();
  }

  addPhotoToCartAction(photo: IPhoto): void {
    const cart = this.photoShoppingCart$.getValue();
    cart.push(photo);
    this.photoShoppingCart$.next(cart);
  }

  showLoginModalAction() {
    this._loginModal$.next({ username: '', password: '' });
  }

  loginAction(data: ILoginRequest) {
    this.api.login(data).subscribe(t => {
      localStorage.setItem('csrf_token', t.token);
      localStorage.setItem('username', data.username);
    });
  }

  logoutAction() {
    localStorage.removeItem('csrf_token');
    localStorage.removeItem('username');
  }

  getUsernameAction() {
    return localStorage.getItem('username');
  }

  postPhotoAction(data) {
    const formData = new FormData();
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }
    return this.api.postPhoto(formData);
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
}
