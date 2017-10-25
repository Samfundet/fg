import { Component, OnInit } from '@angular/core';
import { IForeignKey } from 'app/model';
import { ApiService } from 'app/services';


@Component({
  selector: 'fg-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  albums: IForeignKey[];

  constructor( private api: ApiService ) {
    api.getAlbums().subscribe(x => this.albums = x);
  }

  ngOnInit() {
  }

}
