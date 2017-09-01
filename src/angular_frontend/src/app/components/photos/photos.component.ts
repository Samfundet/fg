import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/services';


@Component({
  selector: 'fg-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  searchInput;
  photos;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    route.queryParamMap.subscribe(params => this.search(params.get('search') || ''));
  }

  ngOnInit() {
  }

  search(value: string) {
    this.searchInput = value;
    this.api.getPhotos({ search: value }).subscribe(response => {
      this.photos = response.results;
    });
  }

  onSearchEnter(value: string) {
    console.log(value);
  }
}
