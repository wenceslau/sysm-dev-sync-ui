import { TestBed } from '@angular/core/testing';

import { SignalsApp } from './signals-app';

describe('SignalsApp', () => {
  let service: SignalsApp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalsApp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
