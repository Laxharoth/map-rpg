import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/classes/Items/Item';
import { ErrorShop, Shop } from 'src/app/classes/Shop/Shop';
import { MasterService } from 'src/app/service/master.service';
import { ShopCurrentItemService } from 'src/app/service/shop-current-item.service';

@Component({
  selector: 'app-shop-data-component',
  templateUrl: './shop-data-component.component.html',
  styleUrls: ['./shop-data-component.component.css']
})
export class ShopDataComponentComponent implements OnInit {

  shop: Shop;
  currentItem:Item=null;
  currentItemSubscription:Subscription;

  constructor(private masterService:MasterService, private shopCurrentItemService:ShopCurrentItemService)
  {
    this.shop = this.masterService.descriptionHandler.currentDescription.descriptionData();
    if(!(this.shop instanceof Shop))this.shop = ErrorShop(this.masterService);
    this.currentItemSubscription= this.shopCurrentItemService.onCurrentItemChanged().subscribe(item => this.currentItem = item);
    this.currentItem = this.shopCurrentItemService.currentItem;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.currentItemSubscription)this.currentItemSubscription.unsubscribe();
  }
}
