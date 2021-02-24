import { Directive } from '@angular/core';
import {
  ElementRef,
  HostBinding,
  HostListener
} from "@angular/core";

@Directive({
  selector: '[appShowmore]'
})
export class ShowmoreDirective {
  element: HTMLElement;
  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }
  @HostBinding("style.white-space") whiteSpace: string;
  @HostBinding("style.overflow-wrap") overflowWrap: string;

  @HostListener("mouseenter") showMore() {
    if (this.element.offsetWidth < this.element.scrollWidth) {
      // this.width = 'fit-content';
      this.whiteSpace = "normal";
      this.overflowWrap = "break-heading";
    }
  }

  @HostListener("mouseleave") showLess() {
    // this.width = null;
    this.whiteSpace = "nowrap";
    this.overflowWrap = null;
  }
}


