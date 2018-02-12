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
  tags: string[] = [];
  motives: string[] = [];
  categories: string[] = [];

  constructor(
    private router: Router,
    public store: StoreService,
    public guard: AuthGuardService,
    private api: ApiService
  ) {
    api.getForeignKey('tags').subscribe(x => {
      x['results'].forEach(t => {
        this.tags.push(t.name);
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
    this.filteredStrings = this.motives.concat(this.tags, this.categories);
    this.filteredStrings = this.filteredStrings.filter(str => str !== undefined);
    this.filteredStrings = this.filteredStrings.filter(str => str.toLowerCase().indexOf(this.searchInput.nativeElement.value) !== -1)
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearchEnter(value: string) {
    this.router.navigate(['/foto'], {
      queryParams: { search: value }
    });
  }

  showLoginModal() {
    this.store.showLoginModalAction();
  }
}
