import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IForeignKey, AlbumChangeEnum } from 'app/model';
import { StoreService, ApiService } from 'app/services';


@Component({
  selector: 'fg-album-modal',
  templateUrl: './album-modal.component.html',
  styleUrls: ['./album-modal.component.scss']
})
export class AlbumModalComponent {

  albumForm: FormGroup;
  shown = false;
  album: IForeignKey;
  // @Input() user: IUser | undefined;
  @Input() changeType: AlbumChangeEnum;

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private api: ApiService,
  ) {
    store.albumModal$.filter(a => !!a).subscribe(album => {
      this.album = album;
      this.albumForm = fb.group(album);
      this.shown = true;
    });
  }

  close() {
    this.shown = false;
    this.album = null;
  }

  save() {
    const foo = {id: this.album.id, ...this.albumForm.value};
    console.log(foo);
    /* this.api.updateAlbum(foo).subscribe(a => console.log(a)); */
  }

}
