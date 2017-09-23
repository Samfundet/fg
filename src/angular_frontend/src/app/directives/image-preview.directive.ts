import { Directive, Input, OnChanges, ElementRef, Renderer, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'img[fgImagePreview]'
})
export class ImagePreviewDirective implements OnChanges {
  @Input() image: any;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnChanges(changes: SimpleChanges) {

    const reader = new FileReader();
    const el = this.el;

    reader.onloadend = function (e) {
      el.nativeElement.src = reader.result;
    };

    if (this.image) {
      return reader.readAsDataURL(this.image);
    }

  }

}
