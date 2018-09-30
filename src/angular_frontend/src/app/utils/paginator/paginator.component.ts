import { IResponse, ISearchParams, PhotoResponse, IPhoto } from 'app/model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fg-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  /*
    Want to know response data from parent so we use Input to get that data to create the paginator
   */
  @Input() response: IResponse<IPhoto>;
  /*
    Want parent to listen for clicks on next/prev page to run search method with new correct params
    We do this by adding an eventemitter to child which emits events, and we have a listener method in
    photoscomponent which is also called newParams (for ease of understanding). This method executes search method
    with new params it also creates depening on what response.previous/next is (and also will add something)
    with changePage
    https://angular.io/guide/component-interaction gives really good explenation about child -> parent communication
   */
  @Output() newParams = new EventEmitter();
  private params = {};
  public pagesToShow: Array<number>;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.response);
  }

  changePage(page: number): void { // Change page based on which page number is clicked
    this.newParams.emit(page.toString());
  }

  previousPage() { // Go to previous page
    this.newParams.emit(this.response.previous.split('?')[1]);
  }

  nextPage() { // Go to next page
    console.log(this.response.next.split('?')[1]);
    this.newParams.emit(this.response.next.split('?')[1]);
  }

  createParams(params: string) { // Create params for new page
    params.split('&').forEach(param => {
      this.params[param.split('=')[0]] = param.split('=')[1];
    });
  }

  makePaginator(totalPages: number, currentPage: number, pageSize: number = 10): Array<number> {
    // Builds a paginator based on available pages. Centers the chosen page in the middle of available pages to show (max 10 at a time)
    let startPage: number;
    let endPage: number;

    if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from({length: endPage}, (_, i) => i + startPage);

    // return object with all pager properties required by the view
    return pages;
  }

}
