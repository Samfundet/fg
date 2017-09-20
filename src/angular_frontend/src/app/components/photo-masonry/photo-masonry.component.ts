import { Component, Input } from '@angular/core';
import { Options } from 'masonry-layout';
import { MasonryLayoutDirective } from 'app/directives';
import { IPhoto, IFilters } from 'app/model';
import { StoreService } from 'app/services/store.service';

@Component({
  selector: 'fg-photo-masonry',
  templateUrl: './photo-masonry.component.html',
  styleUrls: ['./photo-masonry.component.scss']
})
export class PhotoMasonryComponent {
  @Input() photos: IPhoto[];

  masonryOptions: Options = {
    itemSelector: '.grid-item',
    fitWidth: true
  }

  constructor(private store: StoreService) { }

  onPhotoClick(photo: IPhoto) {
    console.log('Hi');
    this.store.photoModal$.next(photo);
  }

}
