import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { ApiService } from 'app/services/api.service';
import { IResponse, IPhoto, IFilters } from 'app/model';

@Injectable()
export class StoreService {
  // The state of the application
  private _photos$ = new BehaviorSubject<IResponse<IPhoto>>(null);
  private _filters$ = new Subject<IFilters>();
  public  photoRouteActive$ = new Subject<boolean>();

  constructor(private api: ApiService) {
    this._filters$.subscribe(f => {
      api.getPhotos(f).subscribe(pr => this.storePhotos(pr))
    })
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

  // getters for observables of the datastreams
  get filters$() {
    return this._filters$.asObservable();
  }
  get photos$() {
    return this._photos$.asObservable();
  }

  // Private methods
  private storePhotos(photos: IResponse<IPhoto>) {
    const r = photos;
    if (this._photos$.getValue()) {
      // We already have photos, lets add the new photos to our list
      const oldPhotoResultList = this._photos$.getValue().results;
      r.results = oldPhotoResultList.concat(photos.results);
    }
    this._photos$.next(r)
  }
}
