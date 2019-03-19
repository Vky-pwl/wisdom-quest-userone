import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTrayComponent } from './question-tray.component';

describe('QuestionTrayComponent', () => {
  let component: QuestionTrayComponent;
  let fixture: ComponentFixture<QuestionTrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionTrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
