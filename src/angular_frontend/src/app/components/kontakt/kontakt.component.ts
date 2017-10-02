import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { IResponse, IUser } from 'app/model';

@Component({
  selector: 'fg-kontakt',
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.scss']
})
export class KontaktComponent implements OnInit {
  aktivePanger: IUser[];
  aktive: IUser[];

  constructor(private api: ApiService) { }

    ngOnInit() {
      this.api.getUsers().subscribe(users => {
        this.aktivePanger = users.results.filter(u => u.aktiv_pang);
        this.aktive = users.results.filter(u => u.aktiv_pang !== true);
      });
    }

}
