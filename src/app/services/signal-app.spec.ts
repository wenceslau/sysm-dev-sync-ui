import { TestBed } from '@angular/core/testing';

import { SignalApp } from './signal-app';

describe('SignalsApp', () => {
  let service: SignalApp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalApp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
