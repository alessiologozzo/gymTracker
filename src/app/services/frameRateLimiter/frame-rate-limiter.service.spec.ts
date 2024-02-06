import { TestBed } from '@angular/core/testing';

import { FrameRateLimiterService } from './frame-rate-limiter.service';

describe('FrameRateLimiterService', () => {
  let service: FrameRateLimiterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrameRateLimiterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
