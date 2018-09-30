import {Component, OnInit} from '@angular/core';
import {StoreService} from 'app/services/store.service';
import {ChangeEnum, IUser, User} from 'app/model';
import {ApiService} from 'app/services/api.service';

@Component({
  selector: 'fg-powerusers',
  templateUrl: './powerusers.component.html',
  styleUrls: ['./powerusers.component.scss']
})
export class PowerusersComponent implements OnInit {
  users: IUser[];
  changeType: ChangeEnum;
  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getPowerUsersAction().filter(r => !!r).subscribe(users => this.users = users);
  }

  delete(user) {
    this.store.deletePowerUserAction(user);
  }
}
