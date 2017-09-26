import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StoreService } from 'app/services';
import { IPhoto } from 'app/model';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';

@Component({
  selector: 'fg-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  photo: IPhoto;
  backgroundImageUrl = ''; // default image
  sanitizedImage;

  constructor(private store: StoreService, private sanitizer: DomSanitizer) {
    this.sanitizedImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.backgroundImageUrl}`);
    if (window.screen.width > 600) {
      this.store.getSplashPhotoAction().subscribe(p => {
        this.photo = p;
        this.setBackgroundImage(p);
      })
    }
  }

  setBackgroundImage(p: IPhoto)  {
    if (p != null && p.photo != null) {
      this.backgroundImageUrl = p.photo.large;
      this.photo = p;
    }
    this.sanitizedImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.backgroundImageUrl}`);
  }
}
