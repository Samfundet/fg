import { Component, Input } from '@angular/core';
import { MasonryLayoutDirective } from 'app/directives';
import { IPhoto, IFilters, IMasonryOptions } from 'app/model';
import { StoreService } from 'app/services/store.service';

@Component({
  selector: 'fg-photo-masonry',
  templateUrl: './photo-masonry.component.html',
  styleUrls: ['./photo-masonry.component.scss']
})
export class PhotoMasonryComponent {
  @Input() photos: IPhoto[];

  masonryOptions: IMasonryOptions = {
    itemSelector: '.grid-item',
    fitWidth: true,
    stagger: 50
  };

  constructor(private store: StoreService) { }

  onPhotoClick(photo: IPhoto) {
    console.log('Hi');
    this.store.photoModal$.next(photo);
  }

}
