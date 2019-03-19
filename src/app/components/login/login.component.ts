import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { ExamViewComponent } from '../exam-view/exam-view.component';
import { PlayService } from 'src/app/play/play.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;

    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private snackBar: MatSnackBar,
    private playService: PlayService,
     public dialog: MatDialog,
     private formBuilder: FormBuilder,
             private authenticationService: AuthenticationService) {
             }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe()
      .subscribe(
        (response) => {
          this.loading = false;
          if (response['status'] === 'success') {
            this.playService.openDialog();
            this.loginForm.reset();
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
