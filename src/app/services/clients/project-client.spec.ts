import { TestBed } from '@angular/core/testing';

import { ProjectClient } from './project-client';

describe('ProjectClient', () => {
  let service: ProjectClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
