import { Component, OnInit } from '@angular/core';
import { IForeignKey, ForeignKeyEnum } from 'app/model';
import { StoreService } from 'app/services/store.service';

@Component({
  selector: 'fg-category',
  templateUrl: './category.component.html',
  styleUrls: ['../archive-admin.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: IForeignKey[];
  changeType: ForeignKeyEnum;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getForeignKeyAction('categories').subscribe(c => this.categories = c);
  }

  edit(category: IForeignKey) {
    this.store.showForeignKeyModalAction(category, 'categories');
    this.changeType = ForeignKeyEnum.Edit;
  }

  delete(category: IForeignKey) {
    this.store.showForeignKeyModalAction(category, 'categories');
    this.changeType = ForeignKeyEnum.Delete;
  }

  create() {
    const fk: IForeignKey = {
      name: '',
    };
    this.store.showForeignKeyModalAction(fk, 'categories');
    this.changeType = ForeignKeyEnum.Create;
  }

}

