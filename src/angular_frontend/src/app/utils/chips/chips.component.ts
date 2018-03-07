import { IForeignKey } from 'app/model';
import { ApiService, StoreService } from 'app/services';
import { Component, Input, ViewChild, ElementRef, OnChanges, EventEmitter, Output } from '@angular/core';
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
  @Input() search: boolean;
  @Input() chips: IForeignKey[] = [];
  @ViewChild('chipInput') chipInput: ElementRef;

  tags: IForeignKey[] = [];
  filteredTags: IForeignKey[] = [];

  propagateChange: any = () => { };

  constructor(private api: ApiService, private store: StoreService) {
    api.getForeignKey('tags').subscribe(x => {
      this.tags = x['results'];
      this.filteredTags = this.tags;
    });
  }

  writeValue(chips: IForeignKey[]) {
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

  onInputChange() {
    // this.filteredTags = this.tags.filter(tag => tag.startsWith(this.chipInput['nativeElement'].value));
    this.filteredTags = this.tags.filter(tag => tag.name.toLowerCase().indexOf(this.chipInput['nativeElement'].value) !== -1);
  }

  addChip(value) {
    if (value && (this.chips.indexOf(value) === -1)) {
      this.chips.push(value);
      this.chipInput.nativeElement.value = '';
      this.filteredTags = this.tags;
      if (this.search) {
        this.store.setSearchTagsAction(this.tags.filter(t => t.name === value.trim())[0]);
      }
    } else {
      this.chipInput['nativeElement'].value = '';
    }
  }

  removeChip(value) {
    this.chips.splice(this.chips.indexOf(value), 1);
    if (this.search) {
      this.store.removeSearchTagAction(this.store.getSearchTagsValue().filter(tag => tag.name === value.trim())[0]);
    }
  }

  removeChipIfEmpty(value) {
    if (!value) {
      this.chips.pop();
      this.filteredTags = this.tags;
    }
  }
}
