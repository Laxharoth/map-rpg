import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusGuiComponent } from './status-gui.component';

describe('StatusGuiComponent', () => {
  let component: StatusGuiComponent;
  let fixture: ComponentFixture<StatusGuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusGuiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
