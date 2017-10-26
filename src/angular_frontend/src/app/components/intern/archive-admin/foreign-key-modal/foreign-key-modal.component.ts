import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IForeignKey, ForeignKeyEnum } from 'app/model';
import { StoreService } from 'app/services';


@Component({
  selector: 'fg-foreign-key-modal',
  templateUrl: './foreign-key-modal.component.html',
  styleUrls: ['./foreign-key-modal.component.scss']
})
export class ForeignKeyModalComponent {

  ForeignKeyEnum = ForeignKeyEnum;
  shown = false;
  foreignKeyForm: FormGroup;
  fk: IForeignKey;
  type: string;

  @Input() changeType: ForeignKeyEnum;

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
  ) {
    store.foreignKeyModal$.skip(1).filter(a => !!a).subscribe(foo => {
      this.fk = foo.fk;
      this.type = foo.type;
      this.foreignKeyForm = fb.group(foo.fk);
      this.shown = true;
    });
  }

  close() {
    this.shown = false;
    this.fk = null;
  }

  save() {
    this.store.updateForeignKeyAction(this.foreignKeyForm.value, this.type);
    this.shown = false;
    this.fk = null;
  }

  delete() {
    this.store.deleteForeignKeyAction(this.fk, this.type);
    this.shown = false;
    this.fk = null;
  }

  create() {
    this.store.createForeignKeyAction(this.foreignKeyForm.value, this.type);
    this.shown = false;
    this.fk = null;
  }

}
