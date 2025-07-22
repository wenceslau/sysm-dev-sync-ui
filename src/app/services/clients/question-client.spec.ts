import { TestBed } from '@angular/core/testing';

import { QuestionClient } from './question-client';

describe('QuestionClient', () => {
  let service: QuestionClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
