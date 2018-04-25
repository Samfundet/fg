import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { ApiService, StoreService } from 'app/services';
import { IForeignKey } from 'app/model';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'fg-chips-big',
  templateUrl: './chips-big.component.html',
  styleUrls: ['../chips/chips.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ChipsBigComponent,
    multi: true
  }]
})
export class ChipsBigComponent implements ControlValueAccessor, OnChanges {
  @Input() search: boolean;
  @Input() chips: IForeignKey[] = [];
  @ViewChild('chipInput') chipInput: ElementRef;

  motives: IForeignKey[] = []; // is motives

  filteredEverything = {}; // Used to create correct search params
  autocomplete: IForeignKey[] = []; // used in autocomplete
  ac: IForeignKey[] = []; // used to filter with input and put into filteredEverything
  params = {};

  propagateChange: any = () => { };

  constructor(private api: ApiService, private store: StoreService) {
    /* Gets different things from API and puts them in arrays to be used later
    this is for nice autocomplete */
    api.getForeignKey('tags').subscribe(t => {
      this.filteredEverything = { 'tags': t, ...this.filteredEverything };
      this.autocomplete = _.concat(this.autocomplete, t);
      this.ac = this.autocomplete;
    });
    api.getForeignKey('mediums').subscribe(m => {
      this.filteredEverything = { 'mediums': m, ...this.filteredEverything };
      this.autocomplete = _.concat(this.autocomplete, m);
      this.ac = this.autocomplete;
    });
    api.getForeignKey('albums').subscribe(a => {
      this.filteredEverything = { 'albums': a, ...this.filteredEverything };
      this.autocomplete = _.concat(this.autocomplete, a);
      this.ac = this.autocomplete;
    });
    api.getForeignKey('places').subscribe(p => {
      this.filteredEverything = { 'places': p, ...this.filteredEverything };
      this.autocomplete = _.concat(this.autocomplete, p);
      this.ac = this.autocomplete;
    });
    api.getForeignKey('categories').subscribe(c => {
      this.filteredEverything = { 'categories': c, ...this.filteredEverything };
      this.autocomplete = _.concat(this.autocomplete, c);
      this.ac = this.autocomplete;
    });
    api.getAllMotives().subscribe(m => {
      m['motives'].forEach((motive, index) => {
        this.motives.push({ name: motive, id: index });
      });
      this.filteredEverything = { 'motives': this.motives, ...this.filteredEverything };
      this.autocomplete = _.concat(this.autocomplete, this.motives);
      this.ac = this.autocomplete;
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
    this.autocomplete = this.ac.filter(v => {
      return v.name.toLowerCase().indexOf(this.chipInput['nativeElement'].value) !== -1;
    });
  }

  createSearchParams(input) { // To anyone who reads this: I'm sorry
  // Creates a JSON with info to be used in search
    for (const key in this.filteredEverything) {
      if (key in this.filteredEverything) {
        console.log(this.filteredEverything[key]);
        this.filteredEverything[key].forEach(e => {
          if (input === e) {
            if (key === 'motive') {
              this.params[key] = e.name;
            } else {
              this.params[key] = e.id;
            }
          }
        });
      }
    }
  }

  addChip(value) {
    // adds chip if input is searchable
    if (value && (this.chips.indexOf(value) === -1)) {
      this.createSearchParams(this.ac.filter(v => v.name === value.trim())[0]);
      this.chips.push(value);
      this.chipInput.nativeElement.value = '';
      this.filteredEverything = this.ac;
      /* if (this.search) {
        this.store.setSearchVarsAction(this.unfilteredEverything.filter(v => v.name === value.trim())[0]);
      } */
      console.log(this.params);
    } else {
      this.chipInput['nativeElement'].value = '';
    }
  }

  removeChip(value) {
    this.chips.splice(this.chips.indexOf(value), 1);
    if (this.search) {
      // this.store.removeSearchVarsAction(this.store.getSearchVarsValue().filter(v => v.name === value.trim())[0]);
    }
  }

  removeChipIfEmpty(value) {
    if (!value) {
      this.chips.pop();
      this.autocomplete = this.ac;
    }
  }


}
