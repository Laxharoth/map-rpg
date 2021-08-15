import { TestBed } from '@angular/core/testing';

import { DescriptionHandlerService } from './description-handler.service';

describe('DescriptionHandlerService', () => {
  let service: DescriptionHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptionHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
