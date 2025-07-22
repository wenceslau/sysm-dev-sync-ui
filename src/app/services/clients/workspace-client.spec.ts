import { TestBed } from '@angular/core/testing';

import { WorkspaceClient } from './workspace-client';

describe('WorkspaceClient', () => {
  let service: WorkspaceClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkspaceClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
