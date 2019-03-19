import { Directive, HostListener, ElementRef } from '@angular/core';
import { PlayService } from '../play.service';

@Directive({
  selector: '[appTrackScroll]'
})
export class TrackScrollDirective {

  constructor(private playService: PlayService, private el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  scroll() {
    console.log('scroll', this.el.nativeElement.scrollTop);
    this.playService.trayScrollTop = this.el.nativeElement.scrollTop;
   }

}
