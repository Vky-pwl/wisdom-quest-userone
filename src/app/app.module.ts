import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { MaterialComponentsRepositoryModule } from './material-components-repository.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { ExamViewComponent } from './components/exam-view/exam-view.component';
import { CoreService } from './core.service';
import { PlayModule } from './play/play.module';
import { ResultComponent } from './components/result/result.component';
import { CertificateComponent } from './components/certificate/certificate.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LandingHeaderComponent } from './components/landing/landing-header/landing-header.component';
import { AboutUsComponent } from './components/landing/about-us/about-us.component';
import { FeatureComponent } from './components/landing/feature/feature.component';
import { ProductComponent } from './components/landing/product/product.component';
import { StoriesComponent } from './components/landing/stories/stories.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ExamViewComponent,
    ResultComponent,
    CertificateComponent,
    ProfileComponent,
    ToolbarComponent,
    SignUpComponent,
    LandingHeaderComponent,
    AboutUsComponent,
    FeatureComponent,
    ProductComponent,
    StoriesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialComponentsRepositoryModule,
    PlayModule,
    AppRoutingModule
  ],
  providers: [
     AuthenticationService,
     CoreService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, SignUpComponent, ExamViewComponent, ResultComponent, CertificateComponent]
})
export class AppModule { }
