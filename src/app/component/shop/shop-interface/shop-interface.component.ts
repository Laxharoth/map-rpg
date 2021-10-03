import { Shop } from './../../../classes/Shop/Shop';
import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/classes/Character/Character';
import { Item } from 'src/app/classes/Items/Item';
import * as jQuery from 'jquery';
import { MasterService } from 'src/app/classes/masterService';

@Component({
  selector: 'app-shop-interface',
  templateUrl: './shop-interface.component.html',
  styleUrls: ['./shop-interface.component.css']
})
export class ShopInterfaceComponent implements OnInit {

  shopAmount: number = 1;
  playerAmount: number = 1;
  shop:Shop;
  player:Character;
  @Input() masterService:MasterService;
  constructor() { }

  ngOnInit(): void {
    this.player = this.masterService.partyHandler.user;
    this.shop = this.masterService.descriptionHandler.currentDescription.descriptionData();
  }
  setShopAmount(amount:number)
  {
    this.shopAmount = amount
  }
  setUserAmount(amount:number)
  {
    this.playerAmount = amount
  }
  shopSellItem(event:any)
  {
    this.shop.shopSellItem(event,this.shopAmount)
  }
  shopRemoveBuyItem(event:any)
  {
    this.shop.shopRemoveBuyItem(event,this.shopAmount)
  }
  shopBuyItem(event:any)
  {
    this.shop.shopBuyItem(event,this.playerAmount)
  }
  shopRemoveSellItem(event:any)
  {
    this.shop.shopRemoveSellItem(event,this.playerAmount)
  }
}
