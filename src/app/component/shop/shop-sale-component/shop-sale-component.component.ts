import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ErrorShop, Shop } from 'src/gameLogic/custom/Class/Shop/Shop';

@Component({
  selector: 'app-shop-sale-component',
  templateUrl: './shop-sale-component.component.html',
  styleUrls: ['./shop-sale-component.component.css']
})
export class ShopSaleComponentComponent implements OnInit {

  player:Character;
  shop:Shop;
  constructor(private masterService:MasterService){
    this.player = this.masterService.partyHandler.user;
    this.shop = this.masterService.sceneHandler.currentScene?.sceneData();
    if(!(this.shop instanceof Shop))this.shop = ErrorShop(this.masterService);
  }
  ngOnInit(): void {
  }
}
