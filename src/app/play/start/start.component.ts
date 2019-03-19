import { Component, OnInit } from '@angular/core';
import { PlayService } from '../play.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(public playService: PlayService ) { }

  ngOnInit() {
  }

  start() {

    const status = {...this.playService.status,
      'currentExamStatus': 'INSTRUCTION',
      'currentSectionStatus': 'PRISTINE',
      'currentQuestionStatus': 'PRISTINE',
    };
   this.playService.update(status);

  }

}
