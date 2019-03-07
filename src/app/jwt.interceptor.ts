import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentEndUser;
        if (this.authenticationService.isExamInProgress) {
            currentEndUser = JSON.parse(localStorage.getItem('currentExaminee'));
        } else {
            currentEndUser = JSON.parse(localStorage.getItem('currentEndUser'));
        }
        if (currentEndUser && currentEndUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentEndUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}
