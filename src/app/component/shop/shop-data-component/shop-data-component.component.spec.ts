import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDataComponentComponent } from './shop-data-component.component';

describe('ShopDataComponentComponent', () => {
  let component: ShopDataComponentComponent;
  let fixture: ComponentFixture<ShopDataComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDataComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDataComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
