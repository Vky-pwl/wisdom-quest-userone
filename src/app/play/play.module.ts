import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionComponent } from './instruction/instruction.component';
import { StartComponent } from './start/start.component';
import { QuestionComponent } from './question/question.component';
import { StopComponent } from './stop/stop.component';
import { PlayComponent } from './play.component';

@NgModule({
  declarations: [StartComponent, InstructionComponent, QuestionComponent, StopComponent, PlayComponent],
  imports: [
    CommonModule
  ]
})
export class PlayModule { }
