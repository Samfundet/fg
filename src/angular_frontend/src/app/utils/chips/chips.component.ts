import { ApiService } from 'app/services';
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
  @Input() chips: string[] = [];
  @ViewChild('chipInput') chipInput: ElementRef;

  tags: string[] = [];
  filteredTags: string[] = [];

  propagateChange: any = () => { };

  constructor(api: ApiService) {
    api.getForeignKey('tags').subscribe(x => {
      x['results'].forEach(t => {
        this.tags.push(t.name);
      });
      this.filteredTags = this.tags;
    });
    console.log('constructor');
  }

  writeValue(chips: string[]) {
    if (chips) {
      this.chips = chips;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
    console.log(this.tags);
  }

  registerOnTouched() { }

  ngOnChanges(inputs) {
    if (inputs.chips) {
      this.propagateChange(this.chips);
    }
  }

  onInputChange() {
    // this.filteredTags = this.tags.filter(tag => tag.startsWith(this.chipInput['nativeElement'].value));
    this.filteredTags = this.tags.filter(tag => tag.toLowerCase().indexOf(this.chipInput['nativeElement'].value) !== -1);
  }

  addChip(value) {
    if (value && (this.chips.indexOf(value) === -1)) {
      this.chips.push(value);
      this.chipInput.nativeElement.value = '';
      this.filteredTags = this.tags;
    } else {
      this.chipInput['nativeElement'].value = '';
    }
  }

  removeChip(value) {
    this.chips.splice(this.chips.indexOf(value), 1);
  }

  removeChipIfEmpty(value) {
    if (!value) {
      this.chips.pop();
      this.filteredTags = this.tags;
    }
  }
}
