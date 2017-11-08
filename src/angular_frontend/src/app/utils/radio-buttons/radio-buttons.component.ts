import { Component, Input, ViewChild, ElementRef } from '@angular/core';
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
export class RadioButtonsComponent implements ControlValueAccessor {
  radios = ['A1', 'A2', 'A3', 'A4', 'A5', 'Digitalt'];
  @Input() format: string;

  propagateChange: any = () => { };

  constructor() { }

  writeValue(format) {
    if (format !== undefined) {
      this.format = format;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  onClick(format) {
    this.format = format;
    this.propagateChange(format);
  }

  isActive(radio: string) {
    return this.format === radio ? 'active' : '';
  }
}
