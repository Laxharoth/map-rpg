import { TestBed } from '@angular/core/testing';

import { EnemyFormationService } from './enemy-formation.service';

describe('EnemyFormationService', () => {
  let service: EnemyFormationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnemyFormationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
