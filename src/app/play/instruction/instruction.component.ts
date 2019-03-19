import { Component, OnInit } from '@angular/core';
import { PlayService } from '../play.service';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss']
})
export class InstructionComponent implements OnInit {

  constructor(public playService: PlayService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  start() {
    let status = {};
    if (this.playService.isExamInstruction) {
       status = {
         ...this.playService.status,
        'currentExamStatus': 'INPROGRESS',
        'currentSectionStatus': 'INSTRUCTION',
        'currentQuestionStatus': 'PRISTINE',
      };
    } else {
       status = {
        ...this.playService.status,
        'currentExamStatus': 'INPROGRESS',
        'currentSectionStatus': 'INPROGRESS',
        'currentQuestionStatus': 'PRISTINE',
      };
    }
    this.playService.update(status);
  }

  logout() {
    this.playService.updateLogout({});
    this.authenticationService.isExamInProgress = false;
  }


}
