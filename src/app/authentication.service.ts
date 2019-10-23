import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalVariable } from './path-config';

const GET_SPECIALIZATION_LIST = 'specialization/list';

@Injectable()
export class AuthenticationService {
    public currentEndUser: any;
    public isExamInProgress = false;
    constructor(private http: HttpClient,
                private router: Router) {

                 this.currentEndUser = JSON.parse(localStorage.getItem('currentEndUser')) || {} ;


                }

    login(username: string, password: string) {
        return this.http.post<any>(`${GlobalVariable.BASE_PUBLIC_URL}candidate/login`, { userName: username, password: password })
            .pipe(map(response => {
                if (response['status'] === 'success') {
                    if (response['object'] && response['object']['token']) {
                        localStorage.setItem('currentEndUser', JSON.stringify(response['object']));
                        this.currentEndUser = JSON.parse(localStorage.getItem('currentEndUser')) || {} ;
                        this.currentEndUser = response['object'];
                        return response;
                    }
                } else {
                }
                return response;
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
                        this.openConductor(response['object']['tinyKey']);
                        return response;
                    }
                } else {
                }
                return response;
            },
            err => {
            }
            ));
    }
    signupLicense(license) {
        return this.http.get<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/attach/${license}`)
            .pipe(map(response => {
                if (response['status'] === 'success') {
                    if (response['object']) {
                        this.openConductor(response['object']['tinyKey']);
                        return response;
                    }
                } else {
                }
                return response;
            },
            err => {
            }
            ));
    }

    logout() {
        localStorage.removeItem('currentEndUser');
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/landing']);
        this.isExamInProgress = false;
    }

    openConductor(tinyKey) {
        const url = `${location.origin}/${location.pathname}/#/play/?link=${tinyKey}`;
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

      getSpecializationList(request) {
        return this.http.post(`${GlobalVariable.BASE_API_URL}${GET_SPECIALIZATION_LIST}`, request);
      }
}
