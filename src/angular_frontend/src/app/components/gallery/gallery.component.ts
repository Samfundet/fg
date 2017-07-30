import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IPhotoResponse } from './gallery.model';

@Component({
  host: {class: 'p-a-1'},
  selector: 'fg-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  fetching = false; // Used to animate loading spinner etc.
  root: IPhotoResponse;

  constructor(public apiService: ApiService) {

  }

  /* TODO, move to own method with default parameter and create listen to scroll to bottom
   * http://stackoverflow.com/questions/40664766/angular2-how-to-detect-scroll-to-bottom-of-html-element */
  ngOnInit() {
    this.apiService.getImages().subscribe(
      (data: IPhotoResponse) => this.root = data,
      err => console.error(err)
    );
  }

  diagnostic(obj) {
    return JSON.stringify(obj);
  }
}
