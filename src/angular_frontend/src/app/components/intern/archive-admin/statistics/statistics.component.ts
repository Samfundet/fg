import { StoreService } from 'app/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fg-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
  }

}
