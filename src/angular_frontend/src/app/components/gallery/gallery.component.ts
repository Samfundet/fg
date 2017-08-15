import { Component, OnInit, ViewChild } from '@angular/core';
// import { ApiService, StoreService } from 'app/services';
import { ApiService } from 'app/services/api.service';
import { StoreService } from 'app/services/store.service';
import { PhotoResponse, IPhotoResponse } from './gallery.model';
import { Options } from 'masonry-layout';
import { MasonryLayoutDirective } from 'app/directives';

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
  @ViewChild(MasonryLayoutDirective) masonryDirective: MasonryLayoutDirective;

  constructor(public apiService: ApiService, private store: StoreService) { }

  /* TODO, move to own method with default parameter and create listen to scroll to bottom
   * http://stackoverflow.com/questions/40664766/angular2-how-to-detect-scroll-to-bottom-of-html-element */
  ngOnInit() {
    this.apiService.getPhotos().subscribe(p => this.storePhotos(p));
  }

  storePhotos(photos: IPhotoResponse) {

    if (this.root) {
      // We already have photos, lets add the previous into the new one
      const oldPhotoResultList = this.root.results;
      this.root = photos;
      this.root.results = oldPhotoResultList.concat(photos.results);
    } else {
      this.root = photos;
    }
  }

  foo() {
    if (this.root && this.root.next) {
      this.apiService.getPhotos(2).subscribe(p => this.storePhotos(p));
    }
  }
}
