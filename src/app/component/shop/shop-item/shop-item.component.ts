import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Item } from 'src/app/classes/Items/Item';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.css']
})
export class ShopItemComponent implements OnInit {

  @Input() item:Item;
  @Output() ShopItemEvent = new EventEmitter<Item>();
  constructor(){ }

  ngOnInit(): void {}

  Emit()
  {
    this.ShopItemEvent.emit(this.item);
  }
  isFinite(number: number): boolean {return isFinite(number)}
}
