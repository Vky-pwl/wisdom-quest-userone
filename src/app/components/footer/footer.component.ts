import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  breakpoint;

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 4;
}

onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 4;
}

}
