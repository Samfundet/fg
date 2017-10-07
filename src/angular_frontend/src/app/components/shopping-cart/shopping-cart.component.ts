import { Component, OnInit } from '@angular/core';
import { StoreService, ApiService } from 'app/services';
import { IPhoto, PhotoResponse } from 'app/model';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fg-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  public cart = this.store.photoShoppingCart$.getValue();
  public cartForm: FormGroup;
  public cartInfoForm: FormControl;


  res: any;
  photo: IPhoto[];

  constructor(
    private store: StoreService,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
  ) {  }

  ngOnInit() {
    console.log(this.cart);
    this.cartForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      postnumber: ['', [Validators.required]],
      place: ['', [Validators.required]],

      email: ['', [Validators.required]],
      size: ['', [Validators.required]],
      post_or_get: [, [Validators.required]],
    });

    const formValue = this.cartForm.value;

  }

  onSubmit() {
    const formValue = this.cartForm.value;
  }

  /*   ngOnDestroy() {
      if (this._sub) {
        this._sub.unsubscribe();
      }
    } */

}
