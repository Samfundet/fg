import { IForeignKey } from './../../model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService, AuthGuardService, ApiService } from 'app/services';

@Component({
  selector: 'fg-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  // searchInput = '';
  @ViewChild('searchBox') searchInput: ElementRef;
  filteredStrings: string[] = [];
  tags: IForeignKey[] = [];
  motives: string[] = [];
  categories: string[] = [];

  constructor(
    private router: Router,
    public store: StoreService,
    public guard: AuthGuardService,
    private api: ApiService
  ) {
    api.getForeignKey('tags').filter(t => !!t).subscribe(x => {
      x.forEach(t => {
        this.tags.push(t);
      });
    });
    api.getAllMotives().subscribe(x => {
      this.motives = x['motives'];
    });
    api.getCategories().subscribe(x => {
      this.categories = x['categories'];
    });
  }

  ngOnInit() {
  }

  onInputChange() {
    this.filteredStrings = this.motives.concat(this.fkToStringArray(this.tags), this.categories).filter(str => str !== undefined);
    this.filteredStrings = this.filteredStrings.filter(str => str.toLowerCase().indexOf(this.searchInput.nativeElement.value) !== -1);
  }

  fkToStringArray(arr: IForeignKey[]): string[] {
    const stringArr: string[] = [];
    arr.forEach(e => {
      stringArr.push(e.name);
    });
    return stringArr;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  createParams(value: string) {
    let params = {};
    if (value.length > 0) {
      this.tags.forEach(tag => {
        if (value === tag.name) {
          params = { 'tags': tag.id };
        }
      });
      if (this.motives.indexOf(value) !== -1) {
        params = { 'motive': value };
      }
    }
    return params;
  }

 onSearchEnter(value: string) {
    this.router.navigate(['/foto'], {
      queryParams: this.createParams(value)
    });
  }

  showLoginModal() {
    this.store.showLoginModalAction();
  }
}
