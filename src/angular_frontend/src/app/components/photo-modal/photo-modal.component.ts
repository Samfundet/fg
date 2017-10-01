import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import { IPhoto } from 'app/model';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'fg-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss']
})
export class PhotoModalComponent {
  photo: IPhoto;
  shown: boolean;

  constructor(private store: StoreService) {
    store.photoModal$.filter(p => !!p).subscribe(p => {
      this.photo = p;
      this.shown = true;
    });
  }

  addToShoppingCart() {
    const cart = this.store.photoShoppingCart$.getValue();
    if (!(cart.indexOf(this.photo) > -1)) {
      this.photo.addedToCart = true;
      cart.push(this.photo);
      this.store.photoShoppingCart$.next(cart);
    }
  }
  removeFromShoppingCart() {
    const cart = this.store.photoShoppingCart$.getValue();
    this.photo.addedToCart = false;
    cart.splice(cart.indexOf(this.photo), 1);
    this.store.photoShoppingCart$.next(cart);
  }

  goToAlbum() {

  }
}
