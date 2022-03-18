import { Component, OnInit } from '@angular/core';
import { MasterService } from "src/app/service/master.service";
import { ShopCurrentItemService } from 'src/app/service/shop-current-item.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { Shop } from 'src/gameLogic/custom/Class/Shop/Shop';

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
  shopInventoryAfterSale:GameItem[]=[];
  items2Shop:GameItem[]=[];
  CharacterInvetoryAfterSale:GameItem[]=[];
  items2Character:GameItem[]=[];
  constructor(private masterService:MasterService,private shopCurrentItemService:ShopCurrentItemService){
    this.player = this.masterService.partyHandler.user;
    this.shop = this.masterService.sceneHandler.currentScene?.sceneData();
    this.reloadShopArrays();
  }
  ngOnInit(): void {}
  setShopAmount(amount:number){
    this.shopAmount = amount
  }
  setUserAmount(amount:number){
    this.playerAmount = amount
  }
  shopSellItem(event:any){
    this.reloadShopArrays()
    this.shop.shopSellItem(event,this.shopAmount)
  }
  shopRemoveBuyItem(event:any){
    this.reloadShopArrays()
    this.shop.shopRemoveBuyItem(event,this.shopAmount)
  }
  shopBuyItem(event:any){
    this.reloadShopArrays()
    this.shop.shopBuyItem(event,this.playerAmount)
  }
  shopRemoveSellItem(event:any){
    this.reloadShopArrays()
    this.shop.shopRemoveSellItem(event,this.playerAmount)
  }
  unsetItem(event:Event){
    event?.stopPropagation();
    this.shopCurrentItemService.currentItem = null;
  }
  private reloadShopArrays() {
    this.shopInventoryAfterSale = this.shop.shopInventoryAfterSale;
    this.items2Shop = this.shop.sale.items2Shop;
    this.CharacterInvetoryAfterSale = this.shop.getCharacterInvetoryAfterSale(this.player);
    this.items2Character = this.shop.sale.items2Character;
  }
}
