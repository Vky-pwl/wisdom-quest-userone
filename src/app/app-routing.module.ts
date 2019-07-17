import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ExamViewComponent } from './components/exam-view/exam-view.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [{
  path: 'landing',
  component: LandingComponent
},
{
  path: 'home',
  component: ExamViewComponent
},
{
  path: 'profile',
  component: ProfileComponent
},
{
  path: '**',
  redirectTo: 'landing',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
