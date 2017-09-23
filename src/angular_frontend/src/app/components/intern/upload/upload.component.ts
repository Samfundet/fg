import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'app/services';
import { IForeignKey } from 'app/model';

@Component({
  selector: 'fg-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  files: File[];
  validComboDrag = false;
  invalidComboDrag = false;
  uploadForm: FormGroup;

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];
  securityLevels: IForeignKey[];

  constructor(private api: ApiService, private fb: FormBuilder) {
    api.getAlbums().subscribe(x => this.albums = x);
    api.getCategories().subscribe(x => this.categories = x);
    api.getMediums().subscribe(x => this.mediums = x);
    api.getPlaces().subscribe(x => this.places = x);
    api.getSecurityLevels().subscribe(x => this.securityLevels = x);
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      page: [1, [Validators.required, Validators.min(0), Validators.max(100)]],
      image_number: [1, [Validators.required]],
      motive: ['Motive_test', [Validators.required]],
      tags: [['foo', 'bar', 'idiot'], []],
      date_taken: [1, [Validators.required]],

      category: [1, [Validators.required]],
      media: [1, [Validators.required]],
      album: [1, [Validators.required]],
      place: [1, [Validators.required]],
      security_level: [1, [Validators.required]],

      lapel: [false, [Validators.required]],
      on_home_page: [false, [Validators.required]],
      splash: [false, [Validators.required]]
    });
  }

  uploadAll() {
    if (this.uploadForm.valid) {

    }
  }

  uploadFile(file: File) {
    if (this.uploadForm.valid) {
      const formValue = this.uploadForm.value;
      formValue.photo = file;
      this.api.uploadPhotos(formValue).subscribe();
    }
  }

  removeFile(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
  }
}
