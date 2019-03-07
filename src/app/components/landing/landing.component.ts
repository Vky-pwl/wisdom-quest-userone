import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private snackBar: MatSnackBar, public dialog: MatDialog) { }




  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.maxLength(14)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      license: ['', Validators.required],
  });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signUpForm.invalid) {
        return;
    }

}

openSnackBar() {
  this.snackBar.openFromComponent(LoginComponent, {
    duration: 500,
  });
}

}
