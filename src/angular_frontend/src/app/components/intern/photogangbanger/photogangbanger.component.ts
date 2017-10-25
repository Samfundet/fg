import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import { IUser, UserChangeEnum } from 'app/model';

@Component({
  selector: 'fg-photogangbanger',
  templateUrl: './photogangbanger.component.html',
  styleUrls: ['./photogangbanger.component.scss']
})
export class PhotogangbangerComponent implements OnInit {
  users: IUser[];
  changeType: UserChangeEnum;
  constructor(private store: StoreService) { }

  ngOnInit() {
    this.store.getFgUsersAction().filter(r => !!r).subscribe(users => this.users = users);
  }

  edit(user: IUser) {
    this.store.showUserModalAction(user);
    this.changeType = UserChangeEnum.Edit;
  }

  delete(user: IUser) {
    this.store.showUserModalAction(user);
    this.changeType = UserChangeEnum.Delete;
  }
}
