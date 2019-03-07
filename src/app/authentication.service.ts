import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalVariable } from '../app-setting.ts/path-config';
import { Router } from '@angular/router';
import { WqCommonService } from 'src/app/shared/services/wq-common.service';
import { ConductorService } from 'src/app/conductor/services/conductor.service';

@Injectable()
export class AuthenticationService {
    public currentEndUser = {};
    public isExamInProgress = false;
    constructor(private http: HttpClient,
                private wqCommonService: WqCommonService,
                private router: Router) {
                 this.currentEndUser = JSON.parse(localStorage.getItem('currentEndUser')) || {} ;
                }

    login(username: string, password: string) {
        return this.http.post<any>(`${GlobalVariable.BASE_PUBLIC_URL}candidate/login`, { userName: username, password: password })
            .pipe(map(response => {
                if (response['status'] === 'success') {
                    if (response['object'] && response['object']['token']) {
                        localStorage.setItem('currentEndUser', JSON.stringify(response['object']));
                        this.currentEndUser = response['object'];
                        return 'login success';
                    }
                } else {
                    this.toaster.error(response['message']);
                }
                return 'login fail';
            },
            err => {
            }
            ));
    }

    signup(req) {
        return this.http.post<any>(`${GlobalVariable.BASE_PUBLIC_URL}candidate/signup`, req)
            .pipe(map(response => {
                if (response['status'] === 'success') {
                    if (response['object']) {
                        this.wqCommonService.start(response['object']['tinyKey'], response['object']['examId']);
                        return 'login success';
                    }
                } else {
                    this.toaster.error(response['message']);
                }
                return 'login fail';
            },
            err => {
            }
            ));
    }

    logout() {
        localStorage.removeItem('currentEndUser');
        this.router.navigate(['auth/landing']);
        if (this.isExamInProgress) {
            const status = {};
              this.conductorService.updateLogout(status);
        }
        // this.router.navigate(['auth/signup']);
    }

    openConductor(tinyKey) {
        const url = `${location.origin}/${location.pathname}/#/exam-conductor/?link=${tinyKey}`;
            const width = Math.max(window.innerWidth,
                         document.documentElement.clientWidth,
                         document.body.clientWidth);
            const height = Math.max(window.innerHeight,
               document.documentElement.clientHeight,
                document.body.clientHeight);
            const top = 0;
            const left = 0;
            const configuration = `top=${top},left=${left},width=${width},height=${height}`;
            window.open(url, 'Wisdom Quest', configuration);
      }
}
