import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSaleComponentComponent } from './shop-sale-component.component';

describe('ShopSaleComponentComponent', () => {
  let component: ShopSaleComponentComponent;
  let fixture: ComponentFixture<ShopSaleComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopSaleComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSaleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
