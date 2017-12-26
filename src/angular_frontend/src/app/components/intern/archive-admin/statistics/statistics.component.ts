import { IPhoto, IStatistics } from 'app/model';
import { StoreService } from 'app/services';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'fg-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss', '../archive-admin.component.scss']
})
export class StatisticsComponent implements OnInit {

  statistics: IStatistics;
  private chartData: Array<any>;

  constructor(private store: StoreService) {
  }


  ngOnInit() {
    this.store.getStatisticsAction().subscribe(s => this.statistics = s);

    // Timeout because i had some problems making it work...
    setTimeout(() => {
      this.dataGen();
    }, 1000);
  }

  dataGen() {
    this.chartData = [];
    let year = (new Date).getFullYear();
    this.statistics.photos_by_year.forEach((item, index) => {
      this.chartData.push([
        `${year}`,
        item
      ]);
      year--;
    });
  }

}
