import { Component, OnInit } from '@angular/core';
import { StoreService, ApiService } from 'app/services';
import { IPhoto, IResponse } from 'app/model';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'fg-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  public cartForm: FormGroup;
  public regretRemovalArray;

  constructor(
    public store: StoreService,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // console.log(this.cart);
    this.cartForm = this.fb.group({
      name: ['Mikkel', [Validators.required]],
      email: ['m@m.com', [Validators.required]],
      address: ['ingen', [Validators.required]],
      place: ['der borte', [Validators.required]],
      zip_code: ['1472', [Validators.required]],
      post_or_get: ['get-by-self', [Validators.required]],
      comment: ['nei', []],
      order_photos: this.createPhotoFormArray(this.store.getPhotoShoppingCartValue())
    });
    this.regretRemovalArray = new Array<IPhoto>();
  }

  createPhotoFormArray(photos: IPhoto[]) {
    return this.fb.array(photos.map(p => this.addOrderPhoto(p)));
  }

  addOrderPhoto(photo: IPhoto) {
    return this.fb.group({
      photo: [photo.id, [Validators.required]],
      format: ['A4', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.cartForm.value.order_photos.length > 0) {
      const formValue = this.cartForm.value;
      this.api.order(formValue).subscribe();
      this.cartForm.value.order_photos.forEach(p => {
        this.store.removePhotoFromCartAction(p);
      });
      // Use ngOnChanges instead?
      this.ngOnInit(); // Have to update cartform to not show text "ønsket format"
    }
  }

  onPhotoClick(photo: IPhoto) {
    this.store.photoModal$.next(photo);
  }

  removePhotoFromCart(photo: IPhoto) {
    this.store.removePhotoFromCartAction(photo);
    this.regretRemovalArray.push(photo);
  }

  regretRemoval() {
    if (this.regretRemovalArray.length < 1) {
      return null;
    }
    this.store.addPhotoToCartAction(this.regretRemovalArray.pop());
  }

}
