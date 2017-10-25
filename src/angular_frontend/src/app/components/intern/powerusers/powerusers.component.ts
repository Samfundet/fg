import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import { IUser } from 'app/model';

@Component({
  selector: 'fg-powerusers',
  templateUrl: './powerusers.component.html',
  styleUrls: ['./powerusers.component.scss']
})
export class PowerusersComponent implements OnInit {
  users: IUser[];
  constructor(private store: StoreService) { }

  ngOnInit() {
    this.store.getPowerUsersAction().filter(r => !!r).subscribe(users => this.users = users);
  }
}
