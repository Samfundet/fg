import { StoreService, ApiService } from 'app/services';
import { INgxMyDpOptions, IMyDate } from 'ngx-mydatepicker';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { DATE_OPTIONS } from 'app/config';
import { IForeignKey, ILatestImageAndPage } from 'app/model';
import { HttpResponse } from '@angular/common/http/src/response';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'fg-register-film',
  templateUrl: './register-film.component.html',
  styleUrls: ['./register-film.component.scss']
})
export class RegisterFilmComponent implements OnInit {
  uploadForm: FormGroup;
  options = DATE_OPTIONS;
  uploadInfo: ILatestImageAndPage;
  startImage: number;
  numberOfImages: number;

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];
  securityLevels: IForeignKey[];

  constructor(
    private store: StoreService,
    private api: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // TODO - change this to use storeservice instead of API?
    // TODO - get only analog albums
    this.albums = store.getFilteredAlbumsAction('ANA');
    api.getCategories().subscribe(c => (this.categories = c));
    api.getMediums().subscribe(m => (this.mediums = m));
    api.getPlaces().subscribe(p => (this.places = p));
    api.getSecurityLevels().subscribe(s => (this.securityLevels = s));
  }

  ngOnInit() {
    const date = new Date();
    this.uploadForm = this.fb.group({
      page: [, [Validators.required, Validators.min(0), Validators.max(100)]],
      image_number: [, [Validators.required]],
      start_image: [, Validators.required],
      number_of_images: [, Validators.required],
      motive: ['Motive_test', [Validators.required]],
      tags: [['foo', 'bar'], []],
      date_taken: [{ jsdate: new Date() }, [Validators.required]],

      category: [1, [Validators.required]],
      media: [1, [Validators.required]],
      album: [, [Validators.required]],
      place: [1, [Validators.required]],
      security_level: [1, [Validators.required]],

      lapel: [false, [Validators.required]],
      scanned: [false, [Validators.required]]
    });
    this.uploadForm.get('album').valueChanges.subscribe(a => {
      this.api.getLatestPageAndImageNumber(a).subscribe(e => {
        this.uploadInfo = e;
        this.uploadForm.patchValue({
          page: this.uploadInfo.latest_page + 1
        });
      });
    });
    this.uploadForm.get('start_image').valueChanges.subscribe(n => {
      this.startImage = n;
      this.uploadForm.patchValue({
        image_number: n
      });
    });
    this.uploadForm
      .get('number_of_images')
      .valueChanges.subscribe(n => (this.numberOfImages = n));
  }

  upload(): void {
    console.log(this.uploadForm.value);
    const date_taken = this.uploadForm.value['date_taken'][
      'jsdate'
    ].toISOString();
    for (let i = 0; i < this.numberOfImages; i++) {
      if (this.uploadForm.valid) {
        this.store
          .postPhotoAction({
            ...this.uploadForm.value,
            date_taken
          })
          .subscribe(e => {
            this.toastr.success(null, 'Opplasting vellykket kanskje?');
          });
        this.uploadForm.patchValue({
          image_number: this.uploadForm.value['image_number'] + 1
        });
      }
    }
    this.ngOnInit();
  }
}
