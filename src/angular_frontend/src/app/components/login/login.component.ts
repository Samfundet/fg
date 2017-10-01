import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService, ApiService } from 'app/services';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'fg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  shown = false;

  constructor(private store: StoreService, private fb: FormBuilder, private router: Router) {
    store.loginModal$.filter(l => !!l).subscribe(l => {
      this.loginForm.setValue(l);
      this.shown = true;
    });

    this.loginForm = fb.group({
      username: [, Validators.required],
      password: [, Validators.required]
    });
  }

  login() {
    this.store.loginAction(this.loginForm.value);
    this.shown = false;
  }
}
