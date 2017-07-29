/* tslint:disable: no-input-rename directive-selector */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import * as imagesLoaded from 'imagesloaded';

import * as Masonry from 'masonry-layout';
// the above does not work for some reasons
//const Masonry = require('masonry-layout');

@Directive({
  selector: '[masonryLayout]',
  exportAs: 'masonryLayout',
})
export class MasonryLayoutDirective implements OnChanges {
  @Input('masonryLayout') columnWidth: number;
  @Input('masonryLength') length: number;

  private masonry: any;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => this.updateLayout(), 0);
  }

  updateLayout(): void {
    if (this.masonry) {
      this.masonry.reloadItems();
      imagesLoaded(this.el.nativeElement).on('progress', () => {
        this.masonry.layout();
      });
    } else {
      this.masonry = new Masonry(this.el.nativeElement, {
        itemSelector: '.masonry-item',
        columnWidth: this.columnWidth,
        gutter: 30,
        transitionDuration: 0,
      });
    }
  }
}
