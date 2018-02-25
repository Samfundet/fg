import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoreService, ApiService } from 'app/services';
import { IForeignKey, ILatestImageAndPage, PartialPhoto, IPhoto, IResponse } from 'app/model';
import { FileUploader, FileUploaderOptions, FileItem } from 'angular-file';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'fg-upload-scanned',
  templateUrl: './upload-scanned.component.html',
  styleUrls: ['./upload-scanned.component.scss']
})
export class UploadScannedComponent implements OnInit {

  albums: IForeignKey[];
  photos: IPhoto[];
  uploadForm: FormGroup;
  photo_ids: number[];
  public uploader: FileUploader = new FileUploader();
  validComboDrag = false;
  invalidComboDrag = false;

  constructor(private store: StoreService, private api: ApiService, private fb: FormBuilder, private toastr: ToastrService) {
    this.albums = store.getFilteredAlbumsAction('ANA');
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      album: [, [Validators.required]],
      page: [, [Validators.required]],
      image_numbers: [, [Validators.required]]
    });
    console.log(this.uploadForm.value['image_numbers']);
  }

  removeItem(item: FileItem) {
    /* this.uploader.removeFromQueue(item);
    if (this.uploader.queue.length === 0) {
      this.uploader = new FileUploader();
    } */
    console.log(item);
  }

  getPhoto() {
  }

  uploadItem(item, id) {
    if (this.uploadForm.valid) {
      item.isUploading = true;
      item.progress = 20;
      console.log(this.getFormValue(item).value['photo']);
      this.api.uploadScannedPhoto(this.getFormValue(item).value, id).subscribe(event => {
        // console.log('Completed: ' + item._file.name);
        item.progress = 100;
        item.isUploaded = true;
        item.isUploading = false;
        item.isSuccess = true;
      },
        error => {
          item.isError = true;
          item.isUploading = false;
          this.toastr.error(null, 'Opplasting feilet 😢');
        });
    }
  }

  /* && this.uploadForm.value['photo_ids'].split(',').length === this.uploader.queue.length */
  /* upload() {
    if (this.uploadForm.valid) {
      this.store.getAnalogNotScannedIdsAction(
        this.uploadForm.value['album'].toString(),
        this.uploadForm.value['page'].toString(),
        this.uploadForm.value['image_numbers'].split(',')
      ).subscribe(data => {
        this.photo_ids = data['photo_ids'];
        for (const item of this.uploader.queue.filter(i => !i.isSuccess)) {
          this.uploadItem(item, this.photo_ids.pop());
          this.api.getPhotosFromIds([this.photo_ids.pop().toString()]).subscribe(p => {
            console.log(p.results[0]);
            const formValues = {photo: item._file, ...this.getFormValue(p.results[0])};
            this.api.updatePhoto(formValues).subscribe(f => console.log(f + this.photos.length));
          });
        }
      });
    }
  } */

  upload() {
    if (this.uploadForm.valid) {
      this.store.getAnalogNotScannedIdsAction(
        this.uploadForm.value['album'].toString(),
        this.uploadForm.value['page'].toString(),
        this.uploadForm.value['image_numbers'].split(',')
      ).subscribe(data => {
        this.photo_ids = data['photo_ids'];
        for (const item of this.uploader.queue.filter(i => !i.isSuccess)) {
          this.uploadItem(item, this.photo_ids.pop());
        }
      });
    }
  }

  getFormValue(item: FileItem) {
    let form: FormGroup;
    form = this.fb.group({
      photo: item._file
    });
    return form;
  }

}
