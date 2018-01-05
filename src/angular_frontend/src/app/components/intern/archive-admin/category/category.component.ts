import { Component, OnInit } from '@angular/core';
import { IForeignKey, ChangeEnum } from 'app/model';
import { StoreService } from 'app/services/store.service';

@Component({
  selector: 'fg-category',
  templateUrl: './category.component.html',
  styleUrls: ['../archive-admin.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: IForeignKey[];
  changeType: ChangeEnum;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.getForeignKeyAction('categories').subscribe(c => this.categories = c);
  }

  edit(category: IForeignKey) {
    this.store.showForeignKeyModalAction(category, 'categories');
    this.changeType = ChangeEnum.Edit;
  }

  delete(category: IForeignKey) {
    this.store.showForeignKeyModalAction(category, 'categories');
    this.changeType = ChangeEnum.Delete;
  }

  create() {
    const fk: IForeignKey = {
      name: '',
    };
    this.store.showForeignKeyModalAction(fk, 'categories');
    this.changeType = ChangeEnum.Create;
  }

}

