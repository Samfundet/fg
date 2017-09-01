import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { IResponse, IUser } from 'app/model';

@Component({
  selector: 'fg-kontakt',
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.scss']
})
export class KontaktComponent implements OnInit {
  users: IUser[];

  constructor(private api: ApiService) { }

    ngOnInit() {
      this.api.getUsers().subscribe(users => this.users = users.results);
    }

}
