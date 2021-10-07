import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Item } from 'src/app/classes/Items/Item';
import { ShopCurrentItemService } from 'src/app/service/shop-current-item.service';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.css']
})
export class ShopItemComponent implements OnInit {

  @Input() item:Item;
  @Input() inventaryOverflow:boolean = false;
  @Output() ShopItemEvent = new EventEmitter<Item>();
  constructor(private shopService: ShopCurrentItemService){ }

  ngOnInit(): void {}

  Emit(){ this.ShopItemEvent.emit(this.item); }
  isFinite(number: number): boolean {return isFinite(number)}
  setItem(event:Event){event.stopPropagation();this.shopService.currentItem = this.item;}
}
