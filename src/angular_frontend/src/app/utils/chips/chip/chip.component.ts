import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'chip', // tslint:disable-line
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() chip: string;
  @Output() onRemoveChip: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  removeChip() {
    this.onRemoveChip.emit(this.chip);
  }
}
