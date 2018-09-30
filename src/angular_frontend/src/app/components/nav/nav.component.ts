import {IForeignKey} from './../../model';
import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {StoreService, AuthGuardService, ApiService} from 'app/services';

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
    /* constructor
     * gets tags, motives and categories to be used for autocomplete
    */
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
    /* ngOnInit is empty because we don't need to do anything special on init */
  }

  onInputChange() {
    /* onInputChange updates the array used for autocomplete */
    this.filteredStrings = this.motives.concat(this.fkToStringArray(this.tags), this.categories).filter(str => str !== undefined);
    this.filteredStrings = this.filteredStrings.filter(str => str.toLowerCase().indexOf(this.searchInput.nativeElement.value) !== -1);
  }

  fkToStringArray(arr: IForeignKey[]): string[] {
    /* fkToStringArray takes an array of ForeignKeys (described in model.ts)
     * it then returns an array of strings so it is usable by the autocomplete
    */
    const stringArr: string[] = [];
    arr.forEach(e => {
      stringArr.push(e.name);
    });
    return stringArr;
  }

  toggleMenu() {
    /* toggleMenu toggles menu if not open and detoggles if open (sidebar menu) */
    this.isMenuOpen = !this.isMenuOpen;
  }

  createParams(value: string) {
    /* createParams creates a JSON object with params in correct format for router to navigate
     * checks if it is a tag or motive
     * it is not (yet) implemented functinality to search for more than these two
     * */
    let params = {};
    if (value.length > 0) {
      this.tags.forEach(tag => {
        if (value === tag.name) {
          params = {'tags': tag.id};
        }
      });
      if (this.motives.indexOf(value) !== -1) {
        params = {'motive': value};
      }
    }
    return params;
  }

  onSearchEnter(value: string) {
    /* onSearchEnter navigates to /foto and sends with params to search with. photos.component handles these params */
    this.router.navigate(['/foto'], {
      queryParams: this.createParams(value)
    });
  }

  showLoginModal() {
    /* showLoginModal shows the modal for login when login button is pressed or when url matches /something-that-requires-login */
    this.store.showLoginModalAction();
  }
}
