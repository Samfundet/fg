import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fg-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: RadioButtonsComponent,
    multi: true
  }]
})
export class RadioButtonsComponent implements ControlValueAccessor, OnChanges {
  /* @Input() radios: IRadio[];

  registerOnChange(fn) {
    this.propagateChange = fn;
  }*/

  @Input() radios: string[];
  @Input() format: string;
  propagateChange: any = () => { }; // Empty function, assign later

  constructor() {
  }

  ngOnChanges(inputs) {
    if (inputs.format) {
      this.propagateChange(this.format);
    }
  }

  writeValue(format: string) {
    if (format) {
      this.format = format;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {

  }

  onClick(format: string) {
    console.log(format);
    this.format = format;
  }

}
