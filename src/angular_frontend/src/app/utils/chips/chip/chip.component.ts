import { IForeignKey } from 'app/model';
import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'chip', // tslint:disable-line
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() chip: IForeignKey;
  @Output() onRemoveChip: EventEmitter<IForeignKey> = new EventEmitter<IForeignKey>();

  constructor() { }

  removeChip() {
    this.onRemoveChip.emit(this.chip);
  }
}
