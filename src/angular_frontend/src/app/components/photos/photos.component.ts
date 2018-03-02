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

  search(filter: IFilters) {
    const searchVal = this.searchForm.value;
    searchVal.tags = [];
    this.store.getSearchTagsValue().forEach(t => searchVal.tags.push(t.id));

    if (filter.hasOwnProperty('search')) {
      this.searchInput = filter.search;
      console.log(this.searchInput);
    }
    this.router.navigate([], {
      queryParams: filter
    });

    this.searching = true;
    this.searchHasOwnProperty(filter);
    this.searchWithParams(filter);
  }

  searchHasOwnProperty(valObj) {
    for (const key in valObj) {
      if (valObj.hasOwnProperty(key)) {
        if (valObj[key] !== null && valObj[key].length < 1) {
          valObj[key] = null;
        }
      }
    }
  }

  searchWithParams(params) {
    this.api.getPhotos(params).subscribe(res => {
      this.photos = res.results;
      this.searching = false;
      this.photosAreLoaded = true;
    });
  }

  initTags(tagNames): string[] {
    tagNames = Array.isArray(tagNames) ? tagNames : [tagNames];
    const tags: string[] = [];
    this.api.getForeignKey('tags').subscribe(ts => {
      console.log(tagNames);
      ts['results'].forEach(tag => {
        if (tagNames.includes(tag.id.toString())) {
          tags.push(tag.name);
          this.store.setSearchTagsAction(tag);
        }
      });
    });
    return tags;
  }

  initialize(filter: any) {
    this.searchForm = this.fb.group({
      motive: [filter.motive, []],
      tags: [filter.tags ? this.initTags(filter.tags) : [], []],
      sort: [filter.sort, []],
      date_taken_from: [filter.date_taken_from, []],
      date_taken_to: [filter.date_taken_to, []],
      category: [filter.category, []],
      media: [filter.media, []],
      album: [filter.album, []],
      place: [filter.place, []]
    });
    this.search(filter);
    console.log(this.searchForm.value.tags);
  }

  toggleAdvanced() {
    this.isAdvanced = !this.isAdvanced;
  }
}
