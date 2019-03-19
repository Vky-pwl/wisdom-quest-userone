import { Component, OnInit } from '@angular/core';
import { PlayService } from '../play.service';
import { setInjectImplementation } from '@angular/core/src/di/injector_compatibility';
import { MatDialogRef } from '@angular/material';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-exam-summary',
  templateUrl: './exam-summary.component.html',
  styleUrls: ['./exam-summary.component.scss']
})
export class ExamSummaryComponent implements OnInit {
  constructor(public playService: PlayService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<ExamSummaryComponent>) { }

  ngOnInit() {

  }

  complete() {
    const status = {
      examRemaingTime: 0,
      currentExamStatus: 'COMPLETED',
      currentSectionStatus: 'COMPLETED',
      currentQuestionStatus: 'COMPLETED',
      currentSectionRemaingTime: 0
     };
      this.playService.updateLogout(status);
      this.authenticationService.isExamInProgress = false;
      this.dialogRef.close();

  }

  continue() {
    this.dialogRef.close();
  }




  getTotalQuestionAnswered(rm) {
    return rm.filter((q) => {
               return q.answered;
    }).length;
  }
}
