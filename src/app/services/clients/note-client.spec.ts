import { TestBed } from '@angular/core/testing';

import { NoteClient } from './note-client';

describe('NoteClient', () => {
  let service: NoteClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
