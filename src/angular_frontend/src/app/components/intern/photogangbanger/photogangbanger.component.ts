import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import { IUser, User, ChangeEnum } from 'app/model';

@Component({
  selector: 'fg-photogangbanger',
  templateUrl: './photogangbanger.component.html',
  styleUrls: ['./photogangbanger.component.scss']
})
export class PhotogangbangerComponent implements OnInit {
  users: IUser[];
  changeType: ChangeEnum;
  constructor(private store: StoreService) { }

  ngOnInit() {
    this.store.getFgUsersAction().filter(r => !!r).subscribe(users => this.users = users);
  }

  edit(user: IUser) {
    this.store.showUserModalAction(user);
    this.changeType = ChangeEnum.Edit;
  }

  delete(user: IUser) {
    this.store.showUserModalAction(user);
    this.changeType = ChangeEnum.Delete;
  }

  create() {
    const user = new User();
    this.store.showUserModalAction(user);
    this.changeType = ChangeEnum.Create;
    console.log(this.changeType);
  }
}
