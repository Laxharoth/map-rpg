import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGuiComponent } from './item-gui.component';

describe('ItemGuiComponent', () => {
  let component: ItemGuiComponent;
  let fixture: ComponentFixture<ItemGuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGuiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
