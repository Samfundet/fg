/**
* This is the heart and soul of the website, the gallery.
 * We define client-side models/interfaces that we use in the template.
 * The template also uses srcset in order to pick the appropriate image size (small, medium, large)
 * according to the pixel-width of the viewing device. On initialization
* */

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

export interface IResult { url: string }

export class Photo {
    prod: string;
    large: string;
    medium: string;
    small: string;
}

export class PhotoResult implements IResult {
    url: string;
    photo: Photo;
    photo_ppoi: string;
    description: string;
    date_taken: Date;
    date_modified: Date;
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
  selector: 'fg-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  fetching = false; // Used to animate loading spinner etc.
  root: IRootObject;

  constructor(public apiService: ApiService) { }

  /* TODO, move to own method with default parameter and create listen to scroll to bottom
  * http://stackoverflow.com/questions/40664766/angular2-how-to-detect-scroll-to-bottom-of-html-element */
  ngOnInit() {
    this.fetching = true;
    this.apiService.getSubscribable('photos').subscribe((root: IRootObject) => {
      this.root = root;
      this.fetching = false;
    })
  }

  diagnostic(obj) {
    return JSON.stringify(obj);
  }

}
