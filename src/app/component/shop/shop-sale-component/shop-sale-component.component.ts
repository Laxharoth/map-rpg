import { ErrorShop } from './../../../classes/Shop/Shop';
import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/classes/Character/Character';
import { Shop } from 'src/app/classes/Shop/Shop';
import { MasterService } from 'src/app/service/master.service';

@Component({
  selector: 'app-shop-sale-component',
  templateUrl: './shop-sale-component.component.html',
  styleUrls: ['./shop-sale-component.component.css']
})
export class ShopSaleComponentComponent implements OnInit {

  player:Character;
  shop:Shop;
  constructor(private masterService:MasterService)
  {
    this.player = this.masterService.partyHandler.user;
    this.shop = this.masterService.descriptionHandler.currentDescription.descriptionData();
    if(!(this.shop instanceof Shop))this.shop = ErrorShop(this.masterService);
  }

  ngOnInit(): void {
  }


}
