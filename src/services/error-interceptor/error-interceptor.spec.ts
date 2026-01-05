import { TestBed } from '@angular/core/testing';
import { ErrorInterceptor } from '../../services/error-interceptor/error-interceptor';

describe('ErrorInterceptor', () => {
  let service: ErrorInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
