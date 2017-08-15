import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { IPhotoResponse } from 'app/components/gallery/gallery.model';

@Injectable()
export class StoreService {
  public photos$ = new BehaviorSubject<IPhotoResponse>(null);

  constructor() { }

}
