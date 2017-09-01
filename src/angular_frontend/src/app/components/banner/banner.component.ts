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
export class BannerComponent implements OnInit {
  photo: IPhoto;
  backgroundImageUrl = '../assets/images/banner.jpg'; // default image
  sanitizedImage;

  constructor(private store: StoreService, private sanitizer: DomSanitizer) {
    this.store.photos$
      .first(p => !!p) // First that isn't null
      .map(pr => pr.results.find(p => p.splash))
      .subscribe(p => this.setBackgroundImage(p));
  }

  setBackgroundImage(p: IPhoto)  {
    if (p != null) {
      this.backgroundImageUrl = p.photo.large;
      this.photo = p;
    }
    this.sanitizedImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.backgroundImageUrl}`);
  }

  ngOnInit() {
  }

}
