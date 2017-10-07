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

  constructor(
    public store: StoreService,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // console.log(this.cart);
    this.cartForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      place: ['', [Validators.required]],
      zip_code: ['', [Validators.required]],
      post_or_get: [, [Validators.required]],
      comment: ['', []],
      order_photos: null
    });

    this.store.photoShoppingCart$.filter(p => !!p).subscribe(photos => {
      // Add to order_photos for each image
      this.cartForm.setControl('order_photos', this.fb.array(photos.map(p => this.addOrderPhoto(p))));

    });

  }

  addOrderPhoto(photo: IPhoto) {
    return this.fb.group({
      photo: [photo.id, [Validators.required]],
      format: ['A4', [Validators.required]]
    });
  }

  onSubmit() {
    const formValue = this.cartForm.value;
    this.api.order(formValue).subscribe(r => console.log(r));
  }

}
