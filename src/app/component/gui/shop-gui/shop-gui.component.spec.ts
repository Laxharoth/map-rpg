import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopGuiComponent } from './shop-gui.component';

describe('ShopGuiComponent', () => {
  let component: ShopGuiComponent;
  let fixture: ComponentFixture<ShopGuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopGuiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
