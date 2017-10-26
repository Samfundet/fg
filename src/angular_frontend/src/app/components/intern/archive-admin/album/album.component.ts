import { Component, OnInit } from '@angular/core';
import { IForeignKey, ChangeEnum } from 'app/model';
import { StoreService } from 'app/services/store.service';


@Component({
  selector: 'fg-album',
  templateUrl: './album.component.html',
  styleUrls: ['../archive-admin.component.scss']
})
export class AlbumComponent implements OnInit {
  albums: IForeignKey[];
  changeType: ChangeEnum;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getForeignKeyAction('albums').subscribe(a => this.albums = a);
  }

  edit(album: IForeignKey) {
    this.store.showForeignKeyModalAction(album, 'albums');
    this.changeType = ChangeEnum.Edit;
  }

  delete(album: IForeignKey) {
    this.store.showForeignKeyModalAction(album, 'albums');
    this.changeType = ChangeEnum.Delete;
  }

  create() {
    const fk: IForeignKey = {
      name: '',
      description: '',
    };
    this.store.showForeignKeyModalAction(fk, 'albums');
    this.changeType = ChangeEnum.Create;
    console.log(this.changeType);
  }

}
