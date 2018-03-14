import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'fg-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() numberOfPages;
  @Input() currentPage;

  constructor() { }

  ngOnInit() {
    const test = _.range(5);
    console.log(test);
  }

  onClick(page: number): void {
    console.log(page);
  }

  makeArrayFromNumber(num: number): Array<number> {
    return _.range(num);
  }

}
