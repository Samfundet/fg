import { Component, OnInit } from '@angular/core';
import { IForeignKey, ChangeEnum } from 'app/model';
import { StoreService } from 'app/services/store.service';

@Component({
  selector: 'fg-media',
  templateUrl: './media.component.html',
  styleUrls: ['../archive-admin.component.scss']
})
export class MediaComponent implements OnInit {

  mediums: IForeignKey[];
  changeType: ChangeEnum;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getForeignKeyAction('mediums').subscribe(m => this.mediums = m);
  }

  edit(media: IForeignKey) {
    this.store.showForeignKeyModalAction(media, 'mediums');
    this.changeType = ChangeEnum.Edit;
  }

  delete(media: IForeignKey) {
    this.store.showForeignKeyModalAction(media, 'mediums');
    this.changeType = ChangeEnum.Delete;
  }

  create() {
    const fk: IForeignKey = {
      name: '',
    };
    this.store.showForeignKeyModalAction(fk, 'mediums');
    this.changeType = ChangeEnum.Create;
  }

}

