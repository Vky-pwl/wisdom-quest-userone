import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionComponent } from './instruction/instruction.component';
import { StartComponent } from './start/start.component';
import { QuestionComponent } from './question/question.component';
import { StopComponent } from './stop/stop.component';
import { PlayComponent } from './play.component';
import { PlayRoutingModule } from './play-routing.module';
import { PlayService } from './play.service';
import { MaterialComponentsRepositoryModule } from '../material-components-repository.module';
import { CountdownModule } from 'ngx-countdown';
import { QuestionHostComponent } from './question-host/question-host.component';
import { QuestionTrayComponent } from './question-tray/question-tray.component';
import { ExamSummaryComponent } from './exam-summary/exam-summary.component';
import { TrackScrollDirective } from './question-tray/track-scroll.directive';

@NgModule({
  declarations: [StartComponent,
    InstructionComponent, QuestionComponent,
     StopComponent, PlayComponent,
      QuestionHostComponent, QuestionTrayComponent, ExamSummaryComponent, TrackScrollDirective],
  imports: [
    CommonModule,
    MaterialComponentsRepositoryModule,
    CountdownModule,
    PlayRoutingModule
  ],
  providers: [ PlayService],
  entryComponents: [ QuestionTrayComponent, ExamSummaryComponent]
})
export class PlayModule { }
