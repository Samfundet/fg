import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private logo = 'assets/images/fg-logo.png';

  constructor() { }

  ngOnInit() {
  }

}
