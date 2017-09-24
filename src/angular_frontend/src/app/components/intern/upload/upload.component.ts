import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEvent } from '@angular/common/http';
import { ApiService } from 'app/services';
import { IForeignKey } from 'app/model';

interface IFile extends File {
  uploading: boolean;
  completed: boolean;
  errored: boolean;
  progress: number;
}

@Component({
  selector: 'fg-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  files: IFile[];
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
      for (const file of this.files.filter(f => !f.completed)) {
        this.uploadFile(file);
      }
    }
  }

  uploadFile(file: IFile) {
    if (this.uploadForm.valid) {
      file.uploading = true;
      file.progress = 20;
      this.api.uploadPhotos({ ...this.uploadForm.value, photo: file })
        .subscribe(() => {
          console.log('Completed: ' + file.name);
          file.completed = true;
          file.progress = 100;
        },
        error => {
          file.errored = true;
          console.error(error);
        });
    }
  }

  removeFile(file: IFile) {
    this.files.splice(this.files.indexOf(file), 1);
  }
}
