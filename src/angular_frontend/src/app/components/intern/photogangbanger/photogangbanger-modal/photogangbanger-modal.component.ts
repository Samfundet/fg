import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IUser, ChangeEnum } from 'app/model';
import { StoreService } from 'app/services';

@Component({
  selector: 'fg-photogangbanger-modal',
  templateUrl: './photogangbanger-modal.component.html',
  styleUrls: ['./photogangbanger-modal.component.scss']
})
export class PhotogangbangerModalComponent {
  ChangeEnum = ChangeEnum;
  userForm: FormGroup;
  shown = false;
  user: IUser;
  @Input() changeType: ChangeEnum;

  constructor(private fb: FormBuilder, private store: StoreService) {
    store.userModal$.filter(u => !!u).subscribe(user => {
      this.user = user;
      this.userForm = fb.group(user);
      this.shown = true;
    });
  }

  close() {
    this.shown = false;
    this.user = null;
  }

  edit() {
    const value = this.userForm.value;
    if (value.bilde === this.user.bilde) {
      delete value.bilde;
    }
    this.store.updateFgUserAction(value);
    this.shown = false;
    this.user = null;
  }

  delete() {
    this.store.deleteFgUserAction(this.user);
    this.shown = false;
    this.user = null;
  }

  create() {
    this.store.createFgUserAction(this.userForm.value);
    this.shown = false;
    this.user = null;
  }
}
