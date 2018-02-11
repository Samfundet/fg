import { IPhoto, IStatistics } from 'app/model';
import { StoreService } from 'app/services';
import { Component, OnInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'fg-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss', '../archive-admin.component.scss']
})
export class StatisticsComponent implements OnInit {

  statistics: IStatistics;
  chartData: Array<any>;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getStatisticsAction().subscribe(s => {
      this.statistics = s;
      this.chartData = this.statistics.photos_by_year;
    });
    // Timeout because we have to wait for statistics to be loaded async
      // TODO same thing for analog and digital images
  }
}
