import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IForeignKey, IResponse, IPhoto } from 'app/model';
import { DATE_OPTIONS } from 'app/config';
import { ApiService, StoreService } from 'app/services';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'fg-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  photoResponse: IResponse<IPhoto>;

  options = DATE_OPTIONS;

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];
  securityLevels: IForeignKey[];

  truthies = [
    { name: '-- Alle --', value: null },
    { name: 'Sant', value: true },
    { name: 'Usant', value: false }
  ];

  constructor(
    private api: ApiService,
    private store: StoreService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    api.getAlbums().subscribe(x => this.albums = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getCategories().subscribe(x => this.categories = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getMediums().subscribe(x => this.mediums = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getPlaces().subscribe(x => this.places = [{ id: null, name: '-- Alle --' }, ...x]);
    api.getSecurityLevels().subscribe(x => this.securityLevels = [{ id: null, name: '-- Alle --' }, ...x]);
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      motive: [, []],
      tags: [, []],
      date_taken_from: [, []],
      date_taken_to: [, []],

      category: [, []],
      media: [, []],
      album: [, []],
      place: [, []],
      security_level: [, []],

      lapel: [, []],
      on_home_page: [, []],
      splash: [, []]
    });
  }

  search() {
    const formValue = this.searchForm.value;
    const date_taken_from = this.searchForm.value.date_taken_from ?
      moment(this.searchForm.value.date_taken_from.jsdate).format('YYYY-MM-DD') : null;
    const date_taken_to = this.searchForm.value.date_taken_to ?
      moment(this.searchForm.value.date_taken_to.jsdates).format('YYYY-MM-DD') : null;
    this.api.getPhotos({...formValue, date_taken_from, date_taken_to}).subscribe(p => this.photoResponse = p);
  }

  delete(photo: IPhoto) {
    console.log('TODO');
  }

  editAllMarked() {
    const ids = this.photoResponse.results.filter(p => p.checkedForEdit).map(p => p.id);
    this.router.navigate(['../rediger'], {
      relativeTo: this.route,
      queryParams: {id: ids}
    });
  }

  check(checked, photo: IPhoto) {
    photo.checkedForEdit = checked;
  }

  onPhotoClick(photo: IPhoto) {
    this.store.photoModal$.next(photo);
  }
}
