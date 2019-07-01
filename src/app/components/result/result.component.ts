import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { GlobalVariable } from 'src/app/path-config';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  Object = Object;

  examId;
  candidateId;
  result;
  eai;
  title;

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<ResultComponent>,
    private snackBar: MatSnackBar,
     public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
   }

  ngOnInit() {
    this.title = 'Result of Exam';
    const req = {
      examId: this.data.examId,
      candidateId: this.data.candidateId,
      testConductorHasTestCodeId: this.data.testConductorHasTestCodeId
    };
    this.http.post<any>(`${GlobalVariable.BASE_API_URL}exam/result-by-examId`, req)
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
        })).subscribe(
          (result) => {
           this.result = result;
          }
        );
        this.http.post<any>(`${GlobalVariable.BASE_API_URL}exam/get-eai-certificate`, req)
        .pipe( map(response => {
            if (response['status'] === 'success') {
                if (response['list']) {
                    return response['list'];
                }
            } else {
                return of([]);
            }
        },
        err => {
          return of([]);
        }
        ), catchError((_err) => {
          return of({});
        })).subscribe(
          (eai) => {
           this.eai = eai;
          }
        );
  }
  }


