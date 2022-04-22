import { Component, Input, OnInit } from '@angular/core';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';

@Component({
  selector: 'app-shop-data-item',
  templateUrl: './shop-data-item.component.html',
  styleUrls: ['./shop-data-item.component.css']
})
export class ShopDataItemComponent implements OnInit {

  @Input() item!:GameItem;
  ngOnInit(): void {
    return undefined;
  }
}
