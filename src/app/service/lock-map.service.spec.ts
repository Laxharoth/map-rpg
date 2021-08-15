import { TestBed } from '@angular/core/testing';

import { LockMapService } from './lock-map.service';

describe('LockMapService', () => {
  let service: LockMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LockMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
