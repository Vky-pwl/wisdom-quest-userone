import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private playService: PlayService
    ) {
    this.authenticationService.isExamInProgress = true;
   }

  ngOnInit() {
   this.playService.configure();
  }

}
