import { TestBed } from '@angular/core/testing';

import { MapHandlerService } from './map-handler.service';

describe('MapHandlerService', () => {
  let service: MapHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
