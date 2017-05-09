import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fg-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  searchInput = 'foo';
  constructor() { }

  ngOnInit() {
  }

}
