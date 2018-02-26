import { HttpParams } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ApiService, StoreService } from 'app/services';
import { IForeignKey, IResponse, IFilters, IPhoto } from 'app/model';

import 'rxjs/add/operator/take';

@Component({
  selector: 'fg-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  animations: [
    trigger('slideDown', [
      state('*', style({
        opacity: 1,
        height: '*'
      })),
      state('void', style({
        opacity: 0,
        height: 0
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
  public photos: IPhoto[];
  photosAreLoaded = false;

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];

  motives: string[] = [];
  filteredMotives: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private store: StoreService,
    private fb: FormBuilder
  ) {
    route.queryParams.take(1).subscribe(params => this.initialize(params as IFilters));
    api.getAlbums().subscribe(x => this.albums = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getCategories().subscribe(x => this.categories = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getMediums().subscribe(x => this.mediums = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getPlaces().subscribe(x => this.places = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getAllMotives().subscribe(x => {
      this.motives = x['motives'];
      this.filteredMotives = x['motives'];
    });
  }

  ngOnInit() {
    this.store.photoRouteActive$.next(true);
    this.searchForm.get('motive').valueChanges.subscribe(m => {
      this.filteredMotives = this.motives.filter(motive => motive.toLowerCase().indexOf(m) !== -1);
    });
  }

  ngOnDestroy() {
    this.store.photoRouteActive$.next(false);
  }

  /* search() {
    const searchVal = this.searchForm.value;
    searchVal.tags = [];
    this.store.getSearchTagsValue().forEach(t => searchVal.tags.push(t.id));
    if (searchVal.tags.length < 1) {
      searchVal.tags = null;
    }

    let filter: IFilters;
    for (const key in searchVal) {
      if (searchVal.hasOwnProperty(key) && searchVal[key] !== null) {
        if (key === 'tags') {

        }else {
          filter.search += key + searchVal[key];
        }
      }
    }

    if (filter.hasOwnProperty('search')) {
      this.searchInput = filter.search;
    }
    this.router.navigate([], {
      queryParams: params
    });

    this.searching = true;
    this.api.getPhotos({...searchVal}).subscribe(response => {
      this.photos = response.results;
      this.searching = false;
      console.log(this.photos);
      this.photosAreLoaded = true;
    });
  } */

  search(filter: IFilters) {
    // console.log(filter);
    const searchVal = this.searchForm.value;
    searchVal.tags = [];
    this.store.getSearchTagsValue().forEach(t => searchVal.tags.push(t.id));
    for (const key in searchVal) {
      if (searchVal.hasOwnProperty(key)) {
        if (searchVal[key] !== null && searchVal[key].length < 1) {
          searchVal[key].length = null;
        }
      }
    }
    this.router.navigate([], {
      queryParams: searchVal
    });
    console.log(searchVal);
    this.searching = true;
    this.api.getPhotos(filter).subscribe(response => {
      this.photos = response.results;
      this.searching = false;
      console.log(this.photos);
      this.photosAreLoaded = true;
    });
  }

  initialize(filter: any) {
    this.searchForm = this.fb.group({
      motive: [filter.motive, []],
      tags: [filter.tags ? (Array.isArray(filter.tags) ? filter.tags : [filter.tags]) : [], []],
      sort: [filter.sort, []],
      date_taken_from: [filter.date_taken_from, []],
      date_taken_to: [filter.date_taken_to, []],
      category: [filter.category, []],
      media: [filter.media, []],
      album: [filter.album, []],
      place: [filter.place, []]
    });
    this.search(filter);
  }

  toggleAdvanced() {
    this.isAdvanced = !this.isAdvanced;
  }
}
