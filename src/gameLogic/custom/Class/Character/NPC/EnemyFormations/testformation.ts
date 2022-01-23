import { descriptionString } from './../../../Descriptions/Description';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { EnemyFormation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation";
import { enemyTest } from "src/gameLogic/custom/Class/Character/NPC/enemyTest";
import { Description } from "src/gameLogic/custom/Class/Descriptions/Description";
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { randomBetween } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { Enemy } from '../../Enemy/Enemy';
import { ItemFactory, item_factory_function } from 'src/gameLogic/custom/Factory/ItemFactory';
import { Factory } from 'src/gameLogic/core/Factory/Factory';

export class testformation extends EnemyFormation
{
  constructor(masterService:MasterService)
  {
      super(masterService)
      //this._enemies = Array.from(Array(randomBetween(1,3))).map(_=>new enemyTest(this.masterService))
      this._enemies = [new enemyTest(this.masterService)]
      this._enemies = [new enemyTest(this.masterService),new enemyTest(this.masterService)]
  }

  protected escapeSuccess():descriptionString
  {
    return ()=>`${this.masterService.partyHandler.user.name} escapes`;
  }
  protected escapeFail():descriptionString
  {
    throw Error("");
  }
  protected escapeCheck(party: Character[]):boolean
  {
    return true;
  }


  protected _enemies: (Character&Enemy)[];
  onEnemyVictory(party: Character[]): Description {
      return this.enemyVictory(party)
  }
  onPartyVictory(party: Character[]): Description {
      return this.partyVictory(party)
  }
  loot():GameItem[]
  {
    const Item = (Factory as item_factory_function)(this.masterService,{Factory:"Item",type:"item-test"})
    Item.amount = randomBetween(1,4);
    const weapon = ItemFactory(this.masterService,{ Factory:'Item',type:'MeleeTest'})
    return [Item,weapon];
  }
  //////////////////////////
  // Enemy Victory
  //////////////////////////
  private enemyVictory(party: Character[]): Description {
    party.forEach(char=>{char.healHitPoints(Infinity)})
      const options = [this.exitOption('next')]
      return {descriptionData:()=>`Enemy won`, options,fixed_options:[null,null,null,null,null]}
  }
  //////////////////////////
  // Party Victory
  //////////////////////////
  private partyVictory(party: Character[]): Description {
    party.forEach(char=>{char.healHitPoints(10)})
      const options = [this.exitOption('next')]
      return {descriptionData:()=>`Party won`, options,fixed_options:[null,null,null,null,null]}
  }
}
