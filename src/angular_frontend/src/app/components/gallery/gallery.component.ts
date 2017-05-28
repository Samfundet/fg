/**
 * This is the heart and soul of the website, the gallery.
 * We define client-side models/interfaces that we use in the template.
 * The template also uses srcset in order to pick the appropriate image size (small, medium, large)
 * according to the pixel-width of the viewing device. On initialization
 * */

import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

export interface IResult { url: string
}

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
  height: number;
  width: number;
  description: string;
  date_taken: Date;
  date_modified: Date;
  tag: string;
  category: string;
  media: string;
  album: string;
  place: string;

  //TODO remove
  klass: string;
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

  constructor(public apiService: ApiService) {
  }

  /* TODO, move to own method with default parameter and create listen to scroll to bottom
   * http://stackoverflow.com/questions/40664766/angular2-how-to-detect-scroll-to-bottom-of-html-element */
  ngOnInit() {
    this.fetching = true;
    this.apiService.getSubscribable('photos').subscribe((root: IRootObject) => {
      this.root = root;
      this.processMasonry();
      this.fetching = false;
    })
  }

  //TODO replicate algorithm from old page
  isLandscape(photoResult: PhotoResult): boolean {
    return photoResult.width / photoResult.height > 1
  }

  diagnostic(obj) {
    return JSON.stringify(obj);
  }

  processMasonry() {


    // Arrange list of pictures into sets, 8 = two landscape stacked, 0 = portrait, O = landscape
    // 1. 8O
    // 2. O
    // 3. 0O
    // 4. O0

    //lppllpppplpllplpllpppp
    //[l-p][p-l][l-p][p-p-p][p-l][p-l][l-p][l-l]
    //[l-p] AND [p-l] AND [p-p-p] = pattern 0
    //[l-l] = pattern 1
    //[p-p-l] = pattern large on first, pattern 0 on rest

    let photoListLength = this.root.results.length;
    for (let i = 0; i < photoListLength;) { //must explicitly increment
      let photoResult = this.root.results[i] as PhotoResult;
      if (i + 1 < photoListLength) {
        let nextPhotoResult = this.root.results[i + 1] as PhotoResult;

        if (this.isLandscape(photoResult)) {
          if (this.isLandscape(nextPhotoResult)) { //[l-l]
            photoResult.klass = 'thumbnail-landscape-landscape';
            nextPhotoResult.klass = 'thumbnail-landscape-landscape';
          } else { //[l-p]
            photoResult.klass = 'thumbnail-landscape-portrait';
            nextPhotoResult.klass = 'thumbnail-landscape-portrait';
          }
          i += 2;
        } else { //portrait
          if (this.isLandscape(nextPhotoResult)) { //[p-l]
            photoResult.klass = 'thumbnail-landscape-portrait';
            nextPhotoResult.klass = 'thumbnail-landscape-portrait';
            i += 2;
          } else { //[p-p]
            if (i + 2 < photoListLength) {
              let nextNextPhotoResult = this.root.results[i + 2] as PhotoResult;
              if (!this.isLandscape(nextPhotoResult)) { //[p-p-p]
                photoResult.klass = 'thumbnail-p-p-p';
                nextPhotoResult.klass = 'thumbnail-p-p-p';
                nextNextPhotoResult.klass = 'thumbnail-p-p-p';
                i += 3;
              } else { //[p-*p-l*]
                // first portrait is large, increment one
                photoResult.klass = 'thumbnail-large';
                i += 1;
              }
            } else {
              photoResult.klass = 'thumbnail-large';
              i += 1;
            }
          }
        }
      } else {
        photoResult.klass = 'thumbnail-large';
        i += 1;
      }
    }
  }


  /*foo(photoResult: PhotoResult): string {
   let classList = [
   "thumbnail-pattern-0",
   "thumbnail-pattern-1",
   "thumbnail-pattern-2",
   "thumbnail-pattern-3"
   ]


   return classList[0];
   }*/
}
