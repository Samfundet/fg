import { Component, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, keyframes, animate } from '@angular/animations';
import { MasonryLayoutDirective } from 'app/directives';
import { IPhoto, IFilters, IMasonryOptions } from 'app/model';
import { StoreService } from 'app/services/store.service';

@Component({
  selector: 'fg-photo-masonry',
  templateUrl: './photo-masonry.component.html',
  styleUrls: ['./photo-masonry.component.scss'],
  animations: [
    trigger('photosAnimation', [
      transition('* => *', [
        query(
          ':enter',
          style({ opacity: 0, transform: 'translateY(-20%)' }),
          {optional: true}
        ),
        query(
          ':enter',
          stagger('100ms', [
            animate('100ms', style({ opacity: 1, transform: 'translateY(0)' }))
          ]),
          {optional: true}
        )
      ])
    ])
  ]
})
export class PhotoMasonryComponent {
  @Input() photos: IPhoto[];

  masonryOptions: IMasonryOptions = {
    itemSelector: '.grid-item',
    fitWidth: true,
    stagger: 50
  };

  constructor(private store: StoreService) { }

  onPhotoClick(photo: IPhoto) {
    this.store.photoModal$.next(photo);
  }

}
