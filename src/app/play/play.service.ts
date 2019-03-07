import {
  Injectable,
  ElementRef
} from '@angular/core';
import {
  of
} from 'rxjs';
import {
  delay, filter, map, catchError
} from 'rxjs/operators';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../path-config';

export interface Status {
  currentExamId?: number;
  currentExamStatus?: string;
  currentSectionId?: number;
  currentSectionStatus?: string;
  currentQuestionId?: number;
  currentQuestionStatus?: string;
  currentSectionRemaingTime?: number;
  examRemaingTime?: number;
}

@Injectable()
export class ConductorService {
  // PRISTINE
  status: Status;

  exam: any ;

  section = {};

  user = {};

  isExamInstruction = true;

  question: any = {};

  questions: any = [];

  link: string;



  constructor(private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
  }
  update(status) {
   status = {...this.status, ...status};
   this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/status-change`, status)
.pipe( map(response => {
    if (response['status'] === 'success') {
      return response;
    } else {
        return of({});
    }
},
err => {
  return of({});
}
), catchError((_err) => {
  return of({});
})).subscribe((response) => {
  this.configure();
});

  }
  updateLogout(status) {
    status = {...this.status, ...status};
    this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/status-change`, status)
 .pipe( map(response => {
     if (response['status'] === 'success') {
       return response;
     } else {
         return of({});
     }
 },
 err => {
   return of({});
 }
 ), catchError((_err) => {
   return of({});
 })).subscribe((response) => {
 });
   }

  next() {
    this.questions = [];

  }
  configure() {
    this.route.queryParams.pipe(
      filter(params => params.link)
    )
    .subscribe(params => {
      console.log(params);

      this.link = params.link;
      console.log(this.link);
    });
    this.getEnviromment().subscribe(
      (env) => {
        console.log('env', env);
        this.exam = JSON.parse(JSON.stringify(env.examVo)) ;
        this.user =  JSON.parse(JSON.stringify(env.userVo));
        localStorage.setItem('currentExaminee', JSON.stringify(this.user));
        this.status =  JSON.parse(JSON.stringify(env.examStatusVo));
        this.redirect();

      });


    }

    redirect() {
      const exam = JSON.parse(JSON.stringify(this.exam));
          this.section = exam.examSectionVoList.filter((section) => {
            return this.status.currentSectionId === section.examSectionId;
          })[0];
           if (this.status.currentExamStatus === 'PRISTINE') {
                this.router.navigate(['exam-conductor/landing'], { queryParamsHandling: 'preserve' });
          } else if (this.status.currentExamStatus === 'INSTRUCTION') {
            this.isExamInstruction = true;
            this.router.navigate(['exam-conductor/instruction'] , { queryParamsHandling: 'preserve' });
          } else if (this.status.currentExamStatus === 'INPROGRESS' &&
            (this.status.currentSectionStatus === 'PRISTINE' ||
              this.status.currentSectionStatus === 'INSTRUCTION')) {
                this.isExamInstruction = false;
                this.router.navigate(['exam-conductor/instruction'], { queryParamsHandling: 'preserve' });
          } else if (this.status.currentExamStatus === 'INPROGRESS' &&
              this.status.currentSectionStatus === 'INPROGRESS') {
                  this.getQuestion(this.status.currentQuestionId);
            } else if (this.status.currentExamStatus === 'COMPLETED' &&
            this.status.currentSectionStatus === 'COMPLETED') {
              this.http.get<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/submit/${this.status.currentExamId}`).subscribe(() => {
                this.router.navigate(['exam-conductor/completed'], { queryParamsHandling: 'preserve' });
              });
          }

    }

    getCurrentStatus() {
      return of(this.status);
    }

    getQuestion(questionId: number) {

    this.questions.push(this.question);
      const req = {
        examId: this.status.currentExamId,
        examRemainingTime: this.status.examRemaingTime,
        sectionRemainingTime: this.status.currentSectionRemaingTime
        };
      this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/get-question`, req)
.pipe( map(response => {

   return response['object'];
},
err => {
  return of({});
}
), catchError((_err) => {
  return of({});
})).subscribe((response) => {
  this.question = response;
  this.questions = [];
  this.questions.push(this.question);
   this.router.navigate(['exam-conductor/quiz'] , { queryParamsHandling: 'preserve' });
});

    }



    submit(optionName) {
      const req = {
        examId: this.status.currentExamId,
        remainingTime: this.status.examRemaingTime,
        sectionRemainingTime: this.status.currentSectionRemaingTime,
        examSectionHasQuestionId: this.status.currentQuestionId,
        userAnswer: optionName,
        active: true,
        sicoFlag: false
        };
      this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/create`, req)
      .pipe( map(response => {
         return response['object'];
      },
      err => {
        return of({});
      }
      ), catchError((_err) => {
        return of({});
      })).subscribe((response) => {
        if (response.examSectionHasQuestionId) {
          this.question = response;
          this.status.currentQuestionId = this.question.examSectionHasQuestionId;
          this.questions = [];
          this.questions.push(this.question);
           this.router.navigate(['exam-conductor/quiz'] , { queryParamsHandling: 'preserve' });
        } else {
            this.configure();
        }
      });

    }


    getEnviromment() {
      return this.http.get<any>(`${GlobalVariable.BASE_PUBLIC_URL}candidate/tinylink-login/${this.link}`)
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
        }));
    }

  }

