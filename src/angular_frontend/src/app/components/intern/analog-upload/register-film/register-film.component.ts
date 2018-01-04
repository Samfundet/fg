import { StoreService, ApiService } from 'app/services';
import { INgxMyDpOptions, IMyDate } from 'ngx-mydatepicker';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DATE_OPTIONS } from 'app/config';
import { IForeignKey } from 'app/model';


@Component({
  selector: 'fg-register-film',
  templateUrl: './register-film.component.html',
  styleUrls: ['./register-film.component.scss']
})
export class RegisterFilmComponent implements OnInit {

  uploadForm: FormGroup;

  options = DATE_OPTIONS;

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];
  securityLevels: IForeignKey[];

  constructor(private store: StoreService, private api: ApiService, private fb: FormBuilder) {
    // TODO - change this to use storeservice instead of API?
    // TODO - get only analog albums
    api.getAlbums().subscribe(a => this.albums = a);
    api.getCategories().subscribe(c => this.categories = c);
    api.getMediums().subscribe(m => this.mediums = m);
    api.getPlaces().subscribe(p => this.places = p);
    api.getSecurityLevels().subscribe(s => this.securityLevels = s);
  }

  ngOnInit() {
    const date = new Date();

    this.uploadForm = this.fb.group({
      page: [1, [Validators.required, Validators.min(0), Validators.max(100)]],
      image_number: [1, [Validators.required, Validators.min(1), Validators.max(36)]], // Have number of images instead?
      motive: ['Motive_test', [Validators.required]],
      tags: [['foo', 'bar'], []],
      date_taken: [{ jsdate: new Date() }, [Validators.required]],

      category: [1, [Validators.required]],
      media: [1, [Validators.required]],
      album: [1, [Validators.required]],
      place: [1, [Validators.required]],
      security_level: [1, [Validators.required]],

      lapel: [false, [Validators.required]],
      on_home_page: [false, [Validators.required]],
      splash: [false, [Validators.required]],
      scanned: [false, [Validators.required]]
    });
  }

  upload() {
    const date_taken = this.uploadForm.value['date_taken']['jsdate'].toISOString();
    if (this.uploadForm.valid) {
      this.store.postPhotoAction({
        ...this.uploadForm.value,
        date_taken
      });
    }
  }
}
