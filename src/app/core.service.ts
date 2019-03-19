import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalVariable } from './path-config';
import { Observable } from 'rxjs';

@Injectable()
export class CoreService {
    public currentEndUser = {};
    public isExamInProgress = false;
    constructor(private http: HttpClient,
                private router: Router) {
                }

                getExamList(): Observable < any[] > {
                    return this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/list`, {
                     'pageNo': 1,
                     'pageSize': 10,
                     'active': true
                   })
                     .pipe( map(response => {
                         if (response['status'] === 'success') {
                             if (response['object'] && response['object']['examVoList']) {
                                 return response['object']['examVoList'];
                             }
                         }
                     }
                     ), catchError((_err) => {
                       return _err;
                     }));
                   }
}
