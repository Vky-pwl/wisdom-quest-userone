import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { PlayService } from '../play.service';
import { CountdownComponent } from 'ngx-countdown';
import { MatSnackBar, MatBottomSheet, MatDialogRef, MatDialog } from '@angular/material';
import { QuestionTrayComponent } from '../question-tray/question-tray.component';
import { ExamSummaryComponent } from '../exam-summary/exam-summary.component';
import { nextContext } from '@angular/core/src/render3';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() question: any;
  @ViewChildren('check') checkBoxGroup: QueryList<any>;
  @ViewChild(CountdownComponent) countdown: CountdownComponent;
  summited = false;
  private interval;
  selectionOption: any;
  config: any;

  constructor(
    public playService: PlayService,
    public authenticationService: AuthenticationService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ) { }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  logout() {
    this.playService.updateLogout({});
    this.authenticationService.isExamInProgress = false;
  }
  ngOnInit() {

    if (this.playService.exam.examCategoryVo.examCategoryName !== 'EMCET') {
      this.config = {
        leftTime: this.playService.status.currentSectionRemaingTime || 0,
        template: `$!h!:$!m!:$!s!`,
        demand: true
      };
    } else {
      this.config = {
        leftTime: this.playService.status.examRemaingTime || 0,
        template: `$!h!:$!m!:$!s!`,
        demand: true
      };
    }
  }

  onFinished() {
    if (this.countdown) {
      this.countdown.stop();
    }

    if (this.playService.exam.examCategoryVo.examCategoryName !== 'EMCET') {

      if (this.playService.status.currentSectionStatus === 'INPROGRESS' && this.playService.status.currentSectionRemaingTime === 0) {
        const status = {
          currentSectionRemaingTime: 0,
          currentSectionStatus: 'COMPLETED'
         };
         this.playService.updateLogout(status);
         this.authenticationService.isExamInProgress = false;
      }

    } else {
      if (this.playService.status.currentExamStatus === 'INPROGRESS' && this.playService.status.examRemaingTime  === 0) {
        const status = {
          examRemaingTime: 0,
          currentExamStatus: 'COMPLETED',
          currentSectionStatus: 'COMPLETED',
          currentQuestionStatus: 'COMPLETED',
          currentSectionRemaingTime: 0
         };
         this.playService.updateLogout(status);
         this.authenticationService.isExamInProgress = false;
      }


    }
  }

  markedForReview(question) {
    this.playService.section.randomMap.map(
      (q) => {
if (q.examSectionHasQuestionId === question.examSectionHasQuestionId) {
  q.markedForReview = true;
  this.playService.updateQuestionStatus();
}
      }
    );
    this.next();
  }

  openQuestionTray() {
    this.bottomSheet.open(QuestionTrayComponent);
  }

  public ngAfterViewInit(): void {

    this.countdown.begin();

    this.interval = setInterval(() => {
      if (this.playService.status.currentSectionRemaingTime > 0) {
        this.playService.status.currentSectionRemaingTime = this.playService.status.currentSectionRemaingTime - 1  ;
      }
      if (this.playService.status.examRemaingTime > 0) {
        this.playService.status.examRemaingTime = this.playService.status.examRemaingTime - 1  ;
      }
  }, 1000);
  }

  switchSection(section) {
    this.playService.status.currentSectionId = section.examSectionId;
    this.playService.section =  this.playService.exam.examSectionVoList.filter((sec) => {
      return this.playService.status.currentSectionId === sec.examSectionId;
    })[0];
    this.playService.getMcatQuestion(section.randomMap[0].examSectionHasQuestionId);

  }

  showExamSummary() {
    const dialogRef = this.dialog.open(ExamSummaryComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  next() {
    this.playService.question.questionBankVo.options.forEach((option) => {
      if (option.checked) {
         this.selectionOption = option ;
      }
    });
    if (this.selectionOption) {
      this.playService.submitMcat(this.selectionOption.optionName);
    } else {
      this.playService.next();
    }
      this.selectionOption = null;
}
  submit() {
    this.playService.question.questionBankVo.options.forEach((option) => {
      if (option.checked) {
         this.selectionOption = option ;
      }
    });
    if (!this.selectionOption) {
      this.snackBar.open('Select option to submit', '', {
        duration: 500,
        horizontalPosition: 'right'
      });
      return;
    } else {
      this.playService.submit(this.selectionOption.optionName);
      this.selectionOption = null;
    }
  }

  answerChange = (o) => {
    // this.checkBoxGroup.forEach((check) => {
    //   if (checkbox.target.id !== check.nativeElement.id) {
    //     check.nativeElement.checked = false;
    //   }
    // });
    this.playService.question.questionBankVo.options.forEach((option) => {
      if (option.optionName === o.optionName && o.checked) {
        option.checked = true;
      } else {
        option.checked = false;
      }
    });
  }

}
