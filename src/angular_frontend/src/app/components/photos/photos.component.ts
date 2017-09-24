import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, StoreService } from 'app/services';
import { IPhoto } from 'app/model';

@Component({
  selector: 'fg-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy {
  searchInput;
  photos: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private store: StoreService
  ) {
    route.queryParamMap.subscribe(params => this.search(params.get('search') || ''));
  }

  ngOnInit() {
    this.store.photoRouteActive$.next(true);
  }

  ngOnDestroy() {
    this.store.photoRouteActive$.next(false);
  }

  search(value: string) {
    this.searchInput = value;
    this.router.navigate([], {
      queryParams: {search: value}
    });
    this.api.getPhotos({ search: value }).subscribe(response => {
      this.photos = response.results;
    });
  }
}
