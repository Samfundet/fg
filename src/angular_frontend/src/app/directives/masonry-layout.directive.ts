/* tslint:disable: no-input-rename directive-selector */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// use @types for these
import * as imagesLoaded from 'imagesloaded';
import * as Masonry from 'masonry-layout';
import { Options } from 'masonry-layout';

@Directive({
  selector: '[masonryLayout]'
})
export class MasonryLayoutDirective implements OnChanges {
  @Input('masonryOptions') options: Options;
  @Input() input: any;
  private masonry: Masonry;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(changes): void {
    setTimeout(() => this.updateLayout(), 0);
  }

  updateLayout(): void {
    imagesLoaded(this.el.nativeElement, () => {
      console.log('Images have loaded!');
      this.masonry = new Masonry(this.el.nativeElement, this.options);
    });
  }
}
