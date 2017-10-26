import { Component, OnInit } from '@angular/core';
import { IForeignKey, AlbumChangeEnum } from 'app/model';
import { StoreService } from 'app/services/store.service';


@Component({
  selector: 'fg-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  albums: IForeignKey[];
  changeType: AlbumChangeEnum;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getAlbumsAction().subscribe(a => this.albums = a);
  }

  edit(album: IForeignKey) {
    this.store.showAlbumModalAction(album);
    this.changeType = AlbumChangeEnum.Edit;
  }

  delete(album: IForeignKey) {
    this.store.showAlbumModalAction(album);
    this.changeType = AlbumChangeEnum.Delete;
  }

}
