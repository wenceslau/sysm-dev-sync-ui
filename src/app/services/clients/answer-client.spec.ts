import { TestBed } from '@angular/core/testing';

import { AnswerClient } from './answer-client';

describe('AnswerClient', () => {
  let service: AnswerClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
