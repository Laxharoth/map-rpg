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

  characterInventory:game_item_dropable[]=[];
  excessItemList:game_item_dropable[]=[];

  private excessItemListUpdateSubscription:Subscription;
  constructor(private masterService:MasterService) {
    this.excessItemListUpdateSubscription = masterService.sceneHandler.onSetScene().subscribe(scene=>{
        if(masterService.gameStateHandler.gameState==="excess-item")
          [this.characterInventory,this.excessItemList] = scene.sceneData()
      });
      [this.characterInventory,this.excessItemList] = masterService.sceneHandler.currentScene?.sceneData();
  }
  ngOnInit(): void {
    return undefined;
  }
  ngOnDestroy(): void {
    if(this.excessItemListUpdateSubscription)this.excessItemListUpdateSubscription.unsubscribe();
  }
}
