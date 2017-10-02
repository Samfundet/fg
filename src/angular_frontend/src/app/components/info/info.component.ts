import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fg-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  printTest() {
    console.log('works');
  }

}
