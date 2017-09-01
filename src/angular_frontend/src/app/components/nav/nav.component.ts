import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fg-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  searchInput = '';

  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
