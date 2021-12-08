import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGuiComponent } from './map-gui.component';

describe('MapGuiComponent', () => {
  let component: MapGuiComponent;
  let fixture: ComponentFixture<MapGuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapGuiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
