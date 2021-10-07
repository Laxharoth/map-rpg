import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDataItemComponent } from './shop-data-item.component';

describe('ShopDataItemComponent', () => {
  let component: ShopDataItemComponent;
  let fixture: ComponentFixture<ShopDataItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDataItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDataItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
