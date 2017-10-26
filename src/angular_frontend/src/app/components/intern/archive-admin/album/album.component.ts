import { Component, OnInit } from '@angular/core';
import { IForeignKey, AlbumChangeEnum } from 'app/model';
import { ApiService } from 'app/services';
import { StoreService } from 'app/services/store.service';


@Component({
  selector: 'fg-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  albums: IForeignKey[];
  changeType: AlbumChangeEnum;
  store: StoreService;

  constructor( private api: ApiService ) {
    api.getAlbums().subscribe(x => this.albums = x);
  }

  ngOnInit() {
    this.store.getAlbumsAction().subscribe(albums => this.albums = albums);
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
