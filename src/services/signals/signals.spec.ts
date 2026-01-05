import { TestBed } from '@angular/core/testing';

import { Signals } from './signals';

describe('Signals', () => {
  let service: Signals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Signals);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
