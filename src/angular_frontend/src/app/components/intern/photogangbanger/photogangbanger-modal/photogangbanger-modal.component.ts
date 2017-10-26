import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IUser, UserChangeEnum } from 'app/model';
import { StoreService } from 'app/services';

@Component({
  selector: 'fg-photogangbanger-modal',
  templateUrl: './photogangbanger-modal.component.html',
  styleUrls: ['./photogangbanger-modal.component.scss']
})
export class PhotogangbangerModalComponent {
  userForm: FormGroup;
  shown = false;
  user: IUser;
  // @Input() user: IUser | undefined;
  @Input() changeType: UserChangeEnum;

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

  save() {

  }
}
