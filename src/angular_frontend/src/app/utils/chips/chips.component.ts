import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fg-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ChipsComponent,
    multi: true
  }]
})
export class ChipsComponent implements ControlValueAccessor, OnChanges {
  @Input() chips: string[];
  @ViewChild('chipInput') chipInput: ElementRef;

  propagateChange: any = () => { };

  constructor() { }

  writeValue(chips: string[]) {
    if (chips) {
      this.chips = chips;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  ngOnChanges(inputs) {
    if (inputs.chips) {
      this.propagateChange(this.chips);
    }
  }

  addChip(value) {
    if (value) {
      this.chips.push(value);
      this.chipInput.nativeElement.value = '';
    }
  }

  removeChip(value) {
    this.chips.splice(this.chips.indexOf(value), 1);
  }

  removeChipIfEmpty(value) {
    if (!value) {
      this.chips.pop();
    }
  }
}
