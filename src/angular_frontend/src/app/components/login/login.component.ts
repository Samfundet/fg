import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { Router } from '@angular/router';
import { StoreService, ApiService } from 'app/services';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {shake} from 'ng-animate';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'fg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('shake', [
      transition('inactive => active', useAnimation(shake, {
        params: {timing: 1, delay: 0}
      })),
      transition('active => inactive', useAnimation(shake, {
        params: {timing: 1, delay: 0}
      }))
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  shown = false;
  wrongPassword;

  constructor(private store: StoreService, private fb: FormBuilder, private router: Router) {
    store.loginModal$.filter(l => !!l).subscribe(l => {
      if (l.hasFailed) {
        this.loginRejected();
      } else {
        this.shown = true;
      }
    });

    this.loginForm = fb.group({
      username: [, Validators.required],
      password: [, Validators.required]
    });
  }

  login() {
    this.store.loginAction(this.loginForm.value);
  }

  loginRejected() {
    this.wrongPassword = (this.wrongPassword === 'inactive' ? 'active' : 'inactive');
  }
}
