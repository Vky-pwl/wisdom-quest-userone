import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, subscribeOn } from 'rxjs/operators';
import { of } from 'rxjs';
import { GlobalVariable } from 'src/app/path-config';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  examId;
  candidateId;
  certificate;
  testConductorHasTestCodeId;
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<CertificateComponent>,
     public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
   }

  ngOnInit() {
    const req = {
      examId: this.data.examId,
      candidateId: this.data.candidateId,
      testConductorHasTestCodeId: this.data.testConductorHasTestCodeId
    };
    this.http.post<any>(`${GlobalVariable.BASE_API_URL}exam/get-certificate`, req)
        .pipe( map(response => {
            if (response['status'] === 'success') {
                if (response['object']) {
                    return response['object'];
                }
            } else {
                return response;
            }
        },
        err => {
          return of({});
        }
        ), catchError((_err) => {
          return _err;
        })).subscribe(
          (certificate) => {
            if (certificate && certificate.certificateId) {
              this.certificate = certificate;
            } else {

            }
          }
        );
  }

}
