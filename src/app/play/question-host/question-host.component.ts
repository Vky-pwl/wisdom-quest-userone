import { Component, OnInit } from '@angular/core';
import { PlayService } from '../play.service';

@Component({
  selector: 'app-question-host',
  templateUrl: './question-host.component.html',
  styleUrls: ['./question-host.component.scss']
})
export class QuestionHostComponent implements OnInit {

  constructor(public playService: PlayService) { }

  ngOnInit() {
  }

}
