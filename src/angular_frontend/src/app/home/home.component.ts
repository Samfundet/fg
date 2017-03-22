import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Response } from '@angular/http';

@Component({
  selector: 'fg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  photoList = [];
  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get("photos").subscribe(response => {
      console.log(response);
      this.photoList = response.results;
    });
  }
}
