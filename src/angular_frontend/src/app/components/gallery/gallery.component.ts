import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PhotoResponse, IResponse, IPhoto } from 'app/model';
import { Options } from 'masonry-layout';
import { MasonryLayoutDirective } from 'app/directives';
import { isNumeric } from 'rxjs/util/isNumeric';

class GalleryParams {
  page: number;

  constructor(params: Params) {
    this.page = isNumeric(params.page) ? +params.page : 1
  }
}

@Component({
  selector: 'fg-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  root: PhotoResponse;
  page: number;
  masonryOptions: Options = {
    itemSelector: '.grid-item',
    fitWidth: true
  }

  constructor(
    public apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /* TODO, move to own method with default parameter and create listen to scroll to bottom
   * http://stackoverflow.com/questions/40664766/angular2-how-to-detect-scroll-to-bottom-of-html-element */
  ngOnInit() {
    // This will always listen to the query parameters and get page number (e.g. '...?page=3' will lead to this.page = 3)
    this.route.queryParams.map(x => new GalleryParams(x)).subscribe(q => this.page = q.page);
    this.apiService.getPhotos(this.page).subscribe(p => this.storePhotos(p));
  }

  storePhotos(photos: IResponse<IPhoto>) {
    if (this.root) {
      // We already have photos, lets add the previous into the new one
      const oldPhotoResultList = this.root.results;
      this.root = photos;
      this.root.results = oldPhotoResultList.concat(photos.results);
    } else {
      this.root = photos;
    }
  }

  getMorePhotos() {
    if (this.root && this.root.next) {
      this.apiService.getPhotos(this.page + 1).subscribe(p => this.setPhotosAndUrl(p, this.page + 1));
    }
  }

  setPhotosAndUrl(photos: IResponse<IPhoto>, page: number) {
    this.storePhotos(photos);
    this.router.navigate([], {
      queryParams: { page: page }
    })
  }
}
