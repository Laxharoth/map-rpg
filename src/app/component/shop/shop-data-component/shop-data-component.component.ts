import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { ShopCurrentItemService } from 'src/app/service/shop-current-item.service';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { ErrorShop, Shop } from 'src/gameLogic/custom/Class/Shop/Shop';

@Component({
  selector: 'app-shop-data-component',
  templateUrl: './shop-data-component.component.html',
  styleUrls: ['./shop-data-component.component.css']
})
export class ShopDataComponentComponent implements OnInit {

  shop: Shop;
  currentItem:GameItem|null=null;
  currentItemSubscription:Subscription;

  constructor(private masterService:MasterService, private shopCurrentItemService:ShopCurrentItemService){
    this.shop = this.masterService.sceneHandler.currentScene?.sceneData();
    if(!(this.shop instanceof Shop))this.shop = ErrorShop(this.masterService);
    this.currentItemSubscription=this.shopCurrentItemService
      .onCurrentItemChanged().subscribe(item => this.currentItem = item);
    this.currentItem = this.shopCurrentItemService.currentItem;
  }
  ngOnInit(): void {
    return undefined;
  }
  ngOnDestroy(): void {
    if(this.currentItemSubscription)this.currentItemSubscription.unsubscribe();
  }
}
