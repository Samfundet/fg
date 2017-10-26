import { Component, OnInit } from '@angular/core';
import { IForeignKey, ForeignKeyEnum } from 'app/model';
import { StoreService } from 'app/services/store.service';

@Component({
  selector: 'fg-place',
  templateUrl: './place.component.html',
  styleUrls: ['../archive-admin.component.scss']
})
export class PlaceComponent implements OnInit {

  places: IForeignKey[];
  changeType: ForeignKeyEnum;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getForeignKeyAction('places').subscribe(p => this.places = p);
  }

  edit(place: IForeignKey) {
    this.store.showForeignKeyModalAction(place, 'places');
    this.changeType = ForeignKeyEnum.Edit;
  }

  delete(place: IForeignKey) {
    this.store.showForeignKeyModalAction(place, 'places');
    this.changeType = ForeignKeyEnum.Delete;
  }

  create() {
    const fk: IForeignKey = {
      name: '',
    };
    this.store.showForeignKeyModalAction(fk, 'places');
    this.changeType = ForeignKeyEnum.Create;
  }

}
