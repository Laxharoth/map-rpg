import { TestBed } from '@angular/core/testing';

import { ShopCurrentItemService } from './shop-current-item.service';

describe('ShopCurrentItemService', () => {
  let service: ShopCurrentItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopCurrentItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
