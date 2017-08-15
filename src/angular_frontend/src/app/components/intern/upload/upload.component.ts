import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from 'app/services';

@Component({
  selector: 'fg-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  upload() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('image', fileBrowser.files[0]);
      this.api.uploadPhotos(formData).subscribe(x => {
        console.log(x);
      });
    }
  }
}
