import { TestBed } from '@angular/core/testing';

import { CommentClient } from './comment-client';

describe('CommentClient', () => {
  let service: CommentClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
