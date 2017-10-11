import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService, AuthGuardService } from 'app/services';

@Component({
  selector: 'fg-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  searchInput = '';

  constructor(private router: Router, public store: StoreService, public guard: AuthGuardService) { }

  ngOnInit() {
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
