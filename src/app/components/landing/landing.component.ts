import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  loading = true;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar, public dialog: MatDialog) { }




  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['MALE', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      license: ['', Validators.required],
  });
  }

  get f() {
    return this.signUpForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signUpForm.invalid) {
      this.snackBar.open('Please fill correct information', '', {
        duration: 500,
        horizontalPosition: 'right'
      });
        return;
    }

    const req = {
      password: this.f.password.value,
      testConductorLicenseCode: this.f.license.value,
      active: true,
      contactEmail: this.f.contactEmail.value,
      contactNumber: this.f.contactNumber.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      gender: this.f.gender.value
};
this.authenticationService.signup(req)
 .pipe()
 .subscribe(
   (response) => {
     this.loading = false;
     if (response['status'] === 'success') {
       this.signUpForm.reset();
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
   },
   error => {
     this.loading = false;
   });

}

openSnackBar() {
  this.snackBar.openFromComponent(LoginComponent, {
    duration: 500,
  });
}

}
