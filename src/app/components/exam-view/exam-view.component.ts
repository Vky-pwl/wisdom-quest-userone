import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AuthenticationService } from 'src/app/authentication.service';
import { ResultComponent } from '../result/result.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateComponent } from '../certificate/certificate.component';

@Component({
  selector: 'app-exam-view',
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.scss']
})
export class ExamViewComponent implements OnInit {
  licenseForm: FormGroup;
  submitted = false;
  loading = false;
  examList = [];
  goLoading = false;
  constructor(
    private coreService: CoreService,
    public authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    // public dialogRef: MatDialogRef<ExamViewComponent>
  ) { }

  ngOnInit() {
    this.loading = true;
    this.licenseForm = this.formBuilder.group({
      license: ['', Validators.required]
    });
    localStorage.setItem('isLoggedIn', 'true' );
    this.coreService.getExamList().subscribe(
      (exams) => {
        this.loading = false;
            this.examList = exams;
      }
    );
  }

  get f() {
    return this.licenseForm.controls;
  }


  result(exam): void {
    const dialogRef = this.dialog.open(ResultComponent, {
      width: '60%',
      data: {examId: exam.examId,
              candidateId: JSON.parse(localStorage.getItem('currentEndUser')).userId,
              testConductorHasTestCodeId: exam.testConductorHasTestCodeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  certificate(exam): void {
    const dialogRef = this.dialog.open(CertificateComponent, {
        data: {examId: exam.examId,
        candidateId: JSON.parse(localStorage.getItem('currentEndUser')).userId,
        testConductorHasTestCodeId: exam.testConductorHasTestCodeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  start(tinyKey, examId): void {
    this.authenticationService.openConductor(tinyKey);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.licenseForm.invalid) {
      return;
    }
    this.goLoading = true;
    this.authenticationService.signupLicense(this.f.license.value)
      .pipe()
      .subscribe(
        (response) => {
          this.goLoading = false;
          if (response['status'] === 'success') {
            this.licenseForm.reset();
          } else {
            let msg = response['message'] ;
            if (response['object'] && response['object']['error']) {
             msg =  response['object']['error'];
            } else {
             msg =  'Unable to process request';
            }
           this.snackBar.open(msg, '', {
             duration: 1000,
             horizontalPosition: 'right'
           });
          }
        });
  }

}
