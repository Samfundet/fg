import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'fg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private user;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.get('users').subscribe(user => this.user = JSON.stringify(user));
  }
}
