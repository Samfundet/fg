import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ApiService, StoreService } from 'app/services';
import { IForeignKey, IResponse, IFilters, IPhoto } from 'app/model';

@Component({
  selector: 'fg-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  animations: [
    trigger('slideDown', [
      state('*', style({
        opacity: 1,
        height: '*',
        transform: 'translateY(0)'
      })),
      state('void', style({
        opacity: 0,
        height: 0,
        transform: 'translateY(-20%)'
      })),
      transition('* => void', animate('400ms ease')),
      transition('void => *', animate('400ms ease'))
    ])
  ],

})
export class PhotosComponent implements OnInit, OnDestroy {
  searchInput;
  searching = false;
  searchForm: FormGroup;
  isAdvanced = false;
  photos: any[];

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private store: StoreService,
    private fb: FormBuilder
  ) {
    route.queryParams.subscribe(params => this.search(params as IFilters));
    api.getAlbums().subscribe(x => this.albums = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getCategories().subscribe(x => this.categories = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getMediums().subscribe(x => this.mediums = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getPlaces().subscribe(x => this.places = [{ id: null, name: '-- Alle --' }, ...x]);
  }

  ngOnInit() {
    this.store.photoRouteActive$.next(true);
    this.searchForm = this.fb.group({
      motive: [, []],
      tags: [, []],
      sort: [, []],
      date_taken_from: [, []],
      date_taken_to: [, []],
      category: [, []],
      media: [, []],
      album: [, []],
      place: [, []]
    });
  }

  ngOnDestroy() {
    this.store.photoRouteActive$.next(false);
  }

  search(filter: IFilters) {
    if (filter.hasOwnProperty('search')) {
      this.searchInput = filter.search;
    }
    this.router.navigate([], {
      queryParams: filter
    });
    this.searching = true;
    this.api.getPhotos(filter).subscribe(response => {
      this.photos = response.results;
      this.searching = false;
    });
  }

  toggleAdvanced() {
    this.isAdvanced = !this.isAdvanced;
  }
}
