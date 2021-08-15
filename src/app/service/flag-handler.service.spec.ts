import { TestBed } from '@angular/core/testing';

import { FlagHandlerService } from './flag-handler.service';

describe('FlagHandlerService', () => {
  let service: FlagHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlagHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
