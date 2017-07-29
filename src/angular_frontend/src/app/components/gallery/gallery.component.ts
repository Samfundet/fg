import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

export interface IPhoto {
  prod: string;
  small: string;
  large: string;
  medium: string;
}

export interface IResult {
  url: string;
  photo: IPhoto;
  height: number;
  width: number;
  description: string;
  date_taken: Date;
  date_modified: Date;
  photo_ppoi: string;
  tag: string;
  category: string;
  media: string;
  album: string;
  place: string;
}

export interface IRootObject {
  count: number;
  next: string;
  previous?: any;
  results: IResult[];
}

@Component({
  host: {class: 'p-a-1'},
  selector: 'fg-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  fetching = false; // Used to animate loading spinner etc.
  root: IRootObject;

  constructor(public apiService: ApiService) {
  }

  /* TODO, move to own method with default parameter and create listen to scroll to bottom
   * http://stackoverflow.com/questions/40664766/angular2-how-to-detect-scroll-to-bottom-of-html-element */
  ngOnInit() {
    this.fetching = true;
    this.apiService.getSubscribable('photos').subscribe((root: IRootObject) => {
      this.root = root;
      this.fetching = false;
    })

  }

  //TODO replicate algorithm from old page
  isLandscape(photoResult: IResult): boolean {
    return photoResult.width / photoResult.height > 1
  }

  diagnostic(obj) {
    return JSON.stringify(obj);
  }

}
