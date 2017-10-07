import { Component, OnInit } from '@angular/core';
import { StoreService, ApiService } from 'app/services';
import { IPhoto, IResponse } from 'app/model';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'fg-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  public cartForm: FormGroup;

  constructor(
    public store: StoreService,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
  ) {  }

  ngOnInit() {
    // console.log(this.cart);
    this.cartForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      postnumber: ['', [Validators.required]],
      place: ['', [Validators.required]],

      email: ['', [Validators.required]],
      size: ['', [Validators.required]],
      post_or_get: [, [Validators.required]],
    });
  }

  onSubmit() {
    const formValue = this.cartForm.value;
    this.api.sendImageOrder(formValue).subscribe();
  }

}
