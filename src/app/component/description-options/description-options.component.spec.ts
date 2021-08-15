import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionOptionsComponent } from './description-options.component';

describe('DescriptionOptionsComponent', () => {
  let component: DescriptionOptionsComponent;
  let fixture: ComponentFixture<DescriptionOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
