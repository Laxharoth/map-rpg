import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { game_item_dropable } from 'src/gameLogic/custom/Class/Scene/SceneAddExceedItem';

@Component({
  selector: 'app-excess-item-gui',
  templateUrl: './excess-item-gui.component.html',
  styleUrls: ['./excess-item-gui.component.css']
})
export class ExcessItemGuiComponent implements OnInit {

  character_inventory:game_item_dropable[]=[];
  excess_item_list:game_item_dropable[]=[];

  private excess_item_list_update_subscription:Subscription;
  constructor(private masterService:MasterService) {
    this.excess_item_list_update_subscription = masterService.sceneHandler.onSetScene().subscribe(scene=>
      {
        if(masterService.gameStateHandler.gameState==="excess-item")
        ( [this.character_inventory,this.excess_item_list]
          =
          scene.sceneData())
      });
      ( [this.character_inventory,this.excess_item_list]
        =
        masterService.sceneHandler.currentScene.sceneData());
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    if(this.excess_item_list_update_subscription)this.excess_item_list_update_subscription.unsubscribe();
  }
}
