import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PlayService } from '../play.service';

@Component({
  selector: 'app-question-tray',
  templateUrl: './question-tray.component.html',
  styleUrls: ['./question-tray.component.scss']
})
export class QuestionTrayComponent implements OnInit, AfterViewInit {

  constructor(public playService: PlayService) { }

  @ViewChild('tray') tray: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tray.nativeElement.scrollTop = this.playService.trayScrollTop;
  }



  getMcatQuestion(q) {
    q.visited = true;
    this.playService.getMcatQuestion(q.examSectionHasQuestionId);
  }

  getNotVisitedCount() {
    if (!this.playService.section.randomMap) {
      return 0;
    }
    return this.playService.section.randomMap.filter((q) => {
      return !q.visited;
    }).length;
  }
  getVisitedCount() {
    if (!this.playService.section.randomMap) {
      return 0;
    }
    return this.playService.section.randomMap.filter((q) => {
      return q.visited;
    }).length;
  }
  getMarkForReviewCount() {
    if (!this.playService.section.randomMap) {
      return 0;
    }
    return this.playService.section.randomMap.filter((q) => {
      return q.markedForReview  && !q.answered;
    }).length;
  }
  getAnsweredAndMarkForReviewCount() {
    if (!this.playService.section.randomMap) {
      return 0;
    }
    return this.playService.section.randomMap.filter((q) => {
      return q.markedForReview && q.answered;
    }).length;
  }
  getAnsweredCount() {
    if (!this.playService.section.randomMap) {
      return 0;
    }
    return this.playService.section.randomMap.filter((q) => {
      return q.answered;
    }).length;
  }

}
