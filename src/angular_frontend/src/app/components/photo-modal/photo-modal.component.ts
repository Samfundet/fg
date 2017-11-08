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
    this.store.addPhotoToCartAction(this.photo);
  }

  removeFromShoppingCart() {
    this.store.removePhotoFromCartAction(this.photo);
  }

  disableRightClick(event) {
    event.preventDefault();
  }
}
