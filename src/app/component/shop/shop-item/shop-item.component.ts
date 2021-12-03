import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShopCurrentItemService } from 'src/app/service/shop-current-item.service';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.css']
})
export class ShopItemComponent implements OnInit {

  @Input() item:GameItem;
  @Input() inventoryOverflow:boolean = false;
  @Output() ShopItemEvent = new EventEmitter<GameItem>();
  constructor(private shopService: ShopCurrentItemService){ }

  ngOnInit(): void {}

  Emit(){ this.ShopItemEvent.emit(this.item); }
  isFinite(number: number): boolean {return isFinite(number)}
  setItem(event:Event)
  {
    event?.stopPropagation();
    this.shopService.currentItem = this.item;
  }
}
