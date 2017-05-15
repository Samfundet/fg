import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

export interface IResult { url: string }

//Photo and Photoresult are specific to photos
export class Photo {
    web: string;
    thumbnail: string;
    full_size: string;
    web2x: string;
}

export class PhotoResult implements IResult {
    url: string;
    photo: Photo;
    photo_ppoi: string;
    date_taken: Date;
    date_modified: Date;
    tag: string;
    category: string;
    media: string;
    album: string;
    place: string;
}

//Everything will have this and iresult,
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

  ngOnInit() {
    this.fetching = true;
    this.apiService.getSubscribable('photos').subscribe((root: IRootObject) => {
      console.log("Root is set yo");
      this.root = root;
      this.fetching = false;
    })
  }

  diagnostic(obj) {
    return JSON.stringify(obj);
  }

}
