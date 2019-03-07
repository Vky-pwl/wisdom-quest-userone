import {
    Injectable
  } from '@angular/core';

import { ConfigurationService } from '../../core/server/configuration.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CertificateComponent } from '../components/certificate/certificate.component';
import { ResultComponent } from '../components/result/result.component';
import { HttpClient } from '@angular/common/http';
import { WqTosterService } from 'src/app/core/services/toaster.service';
import { GlobalVariable } from 'src/app/core/app-setting.ts/path-config';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
  @Injectable()
  export class WqCommonService {

    bsModalRef: BsModalRef;
    defaultConfiguration: any;
    constructor(private configurationService: ConfigurationService,
                private bsModalService: BsModalService,
                private http: HttpClient,
    private toaster: WqTosterService) {

                  this.defaultConfiguration = {
                    keyboard: true,
                    ignoreBackdropClick: true
                  };
                 }

    showCertificate(req): void {
      const configuartion = {
        ...this.defaultConfiguration,
        initialState : {
          examId: req.examId,
          candidateId: req.candidateId
        },
        class: 'modal-lg'
      };
      this.bsModalService.show(CertificateComponent, configuartion);

    }

    showResult(req): void {
      const configuartion = {
        ...this.defaultConfiguration,
        initialState : {
          examId: req.examId,
          candidateId: req.candidateId
        },
        class: 'modal-lg'
      };
      this.bsModalService.show(ResultComponent, configuartion);

    }

    start(tinyKey, examId): void {
     

      this.openConductor(tinyKey);
    }

  

}
