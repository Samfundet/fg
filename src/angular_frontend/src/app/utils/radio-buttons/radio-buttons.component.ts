import { IRadio } from 'app/model';
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
  /* @Input() radios: IRadio[];
  propagateChange: any = () => { }; // Empty function, assign later

  registerOnChange(fn) {
    this.propagateChange = fn;
  }*/

  @Input() radios: boolean[];

  constructor() {
    this.radios = [false, false, false, false, false];
  }

  writeValue() {
  }

  registerOnChange() {
  }

  registerOnTouched() {

  }

  onClick(event) {
    console.log(this.radios);
    for (let i = 0; i < this.radios.length; i++) {
      if (event.target.id === i.toString()) {
        this.radios[i] = true;
      }else {
        this.radios[i] = false;
      }
    }
    console.log(this.radios);
  }

}
