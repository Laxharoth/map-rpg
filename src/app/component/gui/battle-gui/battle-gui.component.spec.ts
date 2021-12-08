import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleGuiComponent } from './battle-gui.component';

describe('BattleGuiComponent', () => {
  let component: BattleGuiComponent;
  let fixture: ComponentFixture<BattleGuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleGuiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
