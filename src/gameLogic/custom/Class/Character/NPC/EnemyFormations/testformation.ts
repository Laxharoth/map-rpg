import { descriptionString } from './../../../Descriptions/Description';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { EnemyFormation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation";
import { enemyTest } from "src/gameLogic/custom/Class/Character/NPC/enemyTest";
import { Description } from "src/gameLogic/custom/Class/Descriptions/Description";
import { MeleeTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeTest';
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { ItemTest } from 'src/gameLogic/custom/Class/Items/ItemTest';
import { randomBetween } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class testformation extends EnemyFormation
{
  constructor(masterService:MasterService)
  {
      super(masterService)
      //this._enemies = Array.from(Array(randomBetween(1,3))).map(_=>new enemyTest(this.masterService))
      this._enemies = [new enemyTest(this.masterService)]
  }

  private descriptionMessage():string {return `${this.masterService.partyHandler.user.name} escapes`}

  protected escapeSuccess():descriptionString
  {
    const nextOption = this.exitOption("Exit");
    return this.descriptionMessage;
  }
  protected escapeFail():descriptionString
  {
    throw Error("");
  }
  protected escapeCheck(party: Character[]):boolean
  {
    return true;
  }


  protected _enemies: Character[];
  onEnemyVictory(party: Character[]): Description {
      return this.enemyVictory(party)
  }
  onPartyVictory(party: Character[]): Description {
      return this.partyVictory(party)
  }
  loot():GameItem[]
  {
    const Item = new ItemTest(this.masterService);
    Item.amount = randomBetween(1,4);
    const weapon = new MeleeTest(this.masterService);
    return [Item,weapon];
  }
  //////////////////////////
  // Enemy Victory
  //////////////////////////
  private enemyVictory(party: Character[]): Description {
    party.forEach(char=>{char.healHitPoints(Infinity)})
      const options = [this.exitOption('next')]
      return new Description(()=>`Enemy won`, options)
  }
  //////////////////////////
  // Party Victory
  //////////////////////////
  private partyVictory(party: Character[]): Description {
    party.forEach(char=>{char.healHitPoints(10)})
      const options = [this.exitOption('next')]
      return new Description(()=>`Party won`, options)
  }
}
