import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PhotoResponse, IResponse, IPhoto, IFilters } from 'app/model';
import { isNumeric } from 'rxjs/util/isNumeric';
import 'rxjs/add/operator/first';

class GalleryParams {
  page: number;

  constructor(params: Params) {
    this.page = isNumeric(params.page) ? +params.page : 1;
  }
}

@Component({
  selector: 'fg-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  constructor(
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.queryParamMap.first().subscribe(params => {
      this.store.getHomePagePhotosAction(params);
      console.log(params);
    });
  }

  getMoreHomePagePhotos() {
    this.store.getMoreHomePagePhotosAction();
  }
}
