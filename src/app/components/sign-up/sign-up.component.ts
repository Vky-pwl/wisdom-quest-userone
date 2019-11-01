import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  loading = true;
  specializationList = [];

    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
             }


  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['MALE', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      license: ['', Validators.required],
      specializationId: ['', Validators.required]
  });
  this.getSpecializationList();
  }

  getSpecializationList(): void {
    const req = {
      pageNo: 1,
      pageSize: 10,
      searchKey: '',
      active: true};
    this.authenticationService.getSpecializationList(req).subscribe(
      (response) => {
        this.loading = false;
        if (response['status'] === 'success') {
                this.specializationList = response['object']['specializationVoList'];
        }
      }
    );
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
      gender: this.f.gender.value,
      specializationId: this.f.specializationId.value
};
this.authenticationService.signup(req)
 .pipe( map(response => {
  if (response['status'] === 'success') {
      if (response['object']) {
          return response['object'];
      }
  } else {
      return of({});
  }
},
err => {
return of({});
}
), catchError((_err) => {
return of({});
}))
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

}
