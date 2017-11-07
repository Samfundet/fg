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
export class RadioButtonsComponent {
  @Input() radio: boolean[];

  propagateChange: any = () => { }; // Empty function, assign later

  constructor() { }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  radioChange() {

  }

}
