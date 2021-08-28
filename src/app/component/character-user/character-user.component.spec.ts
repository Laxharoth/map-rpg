import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterUserComponent } from './character-user.component';

describe('CharacterUserComponent', () => {
  let component: CharacterUserComponent;
  let fixture: ComponentFixture<CharacterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
