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
import { ExamViewComponent } from '../components/exam-view/exam-view.component';
import { MatDialog } from '@angular/material';

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
export class PlayService {
  // PRISTINE
  status: Status;

  exam: any ;

  section: any;

  user: any;

  isExamInstruction = true;

  question: any = {};

  questions: any = [];

  link: string;

  selectedQuestion: any;

  trayScrollTop = 0 ;



  constructor(private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private http: HttpClient) {

  }


  updateQuestionStatus() {
    this.selectedQuestion = this.section.randomMap.filter((q) => {
      return this.status.currentQuestionId === q.examSectionHasQuestionId;
    })[0];
    this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/question-status-update`, this.selectedQuestion)
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
   localStorage.removeItem('currentExaminee');
   localStorage.removeItem('isLoggedIn');
   this.router.navigate(['/landing']);
 });
   }

  next() {

    this.selectedQuestion = this.section.randomMap.filter((q) => {
      return this.status.currentQuestionId === q.examSectionHasQuestionId;
    })[0];
    const index = this.section.randomMap.indexOf(this.selectedQuestion);
    console.log('index', index);
    const next = index + 1;
    console.log('next', next);

    if (this.section.randomMap[next]) {
     this.getMcatQuestion(this.section.randomMap[next].examSectionHasQuestionId);
    } else {
      this.section = this.exam.examSectionVoList.filter((section) => {
        return this.status.currentSectionId === section.examSectionId;
      })[0];
       const sectionIndex = this.exam.examSectionVoList.indexOf(this.section);
       const nextSectionIndex = sectionIndex + 1;
       if (nextSectionIndex < this.exam.examSectionVoList.length) {
        this.section = this.exam.examSectionVoList[nextSectionIndex];
        this.status.currentSectionId = this.section.examSectionId;
        this.trayScrollTop = 0;
        this.getMcatQuestion(this.section.randomMap[0].examSectionHasQuestionId);
       } else {

       }

    }

  }
  configure() {
    this.route.queryParams.pipe(
      filter(params => params.link)
    )
    .subscribe(params => {
      this.link = params.link;
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
     // const exam = JSON.parse(JSON.stringify(this.exam));
          this.section = this.exam.examSectionVoList.filter((section) => {
            return this.status.currentSectionId === section.examSectionId;
          })[0];
           if (this.status.currentExamStatus === 'PRISTINE') {
                this.router.navigate(['play/start'], { queryParamsHandling: 'preserve' });
          } else if (this.status.currentExamStatus === 'INSTRUCTION') {
            if (this.exam.examCategoryVo.examCategoryName === 'EMCET') {
              const status = {
                ...this.status,
                'currentExamStatus': 'INPROGRESS',
                'currentSectionStatus': 'INPROGRESS',
                'currentQuestionStatus': 'PRISTINE',
              };
              this.update(status);
            } else {
            this.isExamInstruction = true;
            this.router.navigate(['play/instruction'] , { queryParamsHandling: 'preserve' });
            }
          } else if (this.status.currentExamStatus === 'INPROGRESS' &&
            (this.status.currentSectionStatus === 'PRISTINE' ||
              this.status.currentSectionStatus === 'INSTRUCTION')) {

                if (this.exam.examCategoryVo.examCategoryName === 'EMCET') {
                  const status = {
                    ...this.status,
                    'currentExamStatus': 'INPROGRESS',
                    'currentSectionStatus': 'INPROGRESS',
                    'currentQuestionStatus': 'PRISTINE',
                  };
                  this.update(status);
                } else {
                  this.isExamInstruction = false;
                this.router.navigate(['play/instruction'], { queryParamsHandling: 'preserve' });

                }
          } else if (this.status.currentExamStatus === 'INPROGRESS' &&
              this.status.currentSectionStatus === 'INPROGRESS') {
                if (this.exam.examCategoryVo.examCategoryName === 'EMCET') {
                  this.getMcatQuestion(this.status.currentQuestionId);
                } else {
                  this.getQuestion(this.status.currentQuestionId);
                }
                this.router.navigate(['play/question'], { queryParamsHandling: 'preserve' });
            } else if (this.status.currentExamStatus === 'COMPLETED' &&
            this.status.currentSectionStatus === 'COMPLETED') {
              this.http.get<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/submit/${this.status.currentExamId}`).subscribe(() => {
                this.router.navigate(['play/stop'], { queryParamsHandling: 'preserve' });
              });
          }

    }

    getCurrentStatus() {
      return of(this.status);
    }

    getQuestion(questionId: number) {

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
  this.questions = [];
  this.question = response;
  this.questions.push(this.question);
   this.router.navigate(['play/question'] , { queryParamsHandling: 'preserve' });
});

    }
    getMcatQuestion(questionId: number) {
      const req = {
        examSectionHasQuestionId: questionId,
        examId: this.status.currentExamId,
        examRemainingTime: this.status.examRemaingTime,
        sectionRemainingTime: this.status.currentSectionRemaingTime
        };
      this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/get-question-question-id`, req)
.pipe( map(response => {

   return response['object'];
},
err => {
  return of({});
}
), catchError((_err) => {
  return of({});
})).subscribe((response) => {
  this.questions = [];
  this.question = response;
  if (this.question) {
    let selectedOptionName = null;
    this.section.randomMap.map((q) => {
      if (this.question.examSectionHasQuestionId === q.examSectionHasQuestionId) {
            q.visited = true;
            selectedOptionName = q.userAnswer;
      }
    });
    this.question.questionBankVo.options.map((o) => {
      if (o.optionName === selectedOptionName) {
            o.checked = true;
      }
    });
    this.questions.push(this.question);
    this.status.currentQuestionId = this.question.examSectionHasQuestionId;
    this.updateQuestionStatus();
  }
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
          this.questions = [];
          this.question = response;
          this.questions.push(this.question);
          this.status.currentQuestionId = this.question.examSectionHasQuestionId;
          this.router.navigate(['play/question'] , { queryParamsHandling: 'preserve' });
        } else {
            this.configure();
        }
      });

    }
    submitMcat(optionName) {
      let req;
      debugger;
      if (optionName) {
         req = {
          examId: this.status.currentExamId,
          remainingTime: this.status.examRemaingTime,
          sectionRemainingTime: this.status.currentSectionRemaingTime,
          examSectionHasQuestionId: this.status.currentQuestionId,
          userAnswer: optionName,
          active: true,
          sicoFlag: false,
          candidateId: this.user.userId
          };
          this.section.randomMap.map((q) => {
            if (this.status.currentQuestionId === q.examSectionHasQuestionId) {
                  q.userAnswer = optionName;
            }
          });
          debugger;
      } else {
        req = {
          examId: this.status.currentExamId,
          remainingTime: this.status.examRemaingTime,
          sectionRemainingTime: this.status.currentSectionRemaingTime,
          examSectionHasQuestionId: this.status.currentQuestionId,
          userAnswer: null,
          active: false,
          sicoFlag: false,
          candidateId: this.user.userId
          };

          this.section.randomMap.map((q) => {
            if (this.status.currentQuestionId === q.examSectionHasQuestionId) {
                  q.answered = false;
            }
          });

      }
debugger;
      this.http.post<any>(`${GlobalVariable.BASE_API_URL}candidate-exam/submit-answer`, req)
      .pipe( map(response => {
         return response;
      },
      err => {
        return of({});
      }
      ), catchError((_err) => {
        return of({});
      })).subscribe((response) => {
        if (response['status'] === 'success') {
        this.section.randomMap.map((q) => {
            if (this.status.currentQuestionId === q.examSectionHasQuestionId) {
                  q.answered = true;
            }
          });
          this.updateQuestionStatus();
         this.next();
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

    openDialog(): void {
      const dialogRef = this.dialog.open(ExamViewComponent, {
        width: '80vw',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }

  }

