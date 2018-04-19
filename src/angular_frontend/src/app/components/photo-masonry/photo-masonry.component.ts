import { Component, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, keyframes, animate } from '@angular/animations';
import { MasonryLayoutDirective } from 'app/directives';
import { IPhoto, IFilters, IMasonryOptions } from 'app/model';
import { StoreService } from 'app/services/store.service';
import { OnInit, AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'fg-photo-masonry',
  templateUrl: './photo-masonry.component.html',
  styleUrls: ['./photo-masonry.component.scss']
})
export class PhotoMasonryComponent implements OnInit {
  @Input() photos: IPhoto[];
  inCartPhotos: number[];

  masonryOptions: IMasonryOptions = {
    itemSelector: '.grid-item',
    fitWidth: true,
    stagger: 50
  };

  constructor(protected store: StoreService) {
    store.photoShoppingCart$.filter(p => !!p).subscribe(ps => this.inCartPhotos = ps.map(x => x.id));
  }

  onPhotoClick(photo: IPhoto) {
    this.store.photoModal$.next(photo);
  }

  ngOnInit() {
    this.photos.forEach(p => {
      if (this.inCartPhotos !== undefined && this.inCartPhotos.indexOf(p.id) !== -1) {
        p.addedToCart = true;
      }
    });
  }

  addToShoppingCart(photo: IPhoto) {
    this.store.addPhotoToCartAction(photo);
  }

  removeFromShoppingCart(photo: IPhoto) {
    this.store.removePhotoFromCartAction(photo);
  }

  disableRightClick(event) {
    event.preventDefault();
  }
}
