import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, StoreService } from 'app/services';

@Component({
  selector: 'fg-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy {
  searchInput;
  photos;

  constructor(private route: ActivatedRoute, private api: ApiService, private store: StoreService) {
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
    this.api.getPhotos({ search: value }).subscribe(response => {
      this.photos = response.results;
    });
  }
}
