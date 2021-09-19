import { ItemTest } from './../../../Items/ItemTest';
import { Description, DescriptionOptions } from "src/app/classes/Descriptions/Description";
import { Item } from "src/app/classes/Items/Item";
import { MasterService } from "src/app/classes/masterService";
import { randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character";
import { enemyTest } from "../enemyTest";
import { EnemyFormation } from "./EnemyFormation";

export class testformation extends EnemyFormation
{
  constructor(masterService:MasterService)
  {
      super(masterService)
      //this._enemies = Array.from(Array(randomBetween(1,3))).map(_=>new enemyTest(this.masterService))
      this._enemies = [new enemyTest(this.masterService)]
  }

  get descriptionMessage():string {return `${this.masterService.partyHandler.user.name} escapes`}

  protected escapeSuccess():Description
  {
    const nextOption = this.exitOption("Exit");
    return new Description(()=>this.descriptionMessage,[nextOption]);
  }
  protected escapeFail():Description
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
  loot():Item[]
  {
    const Item = new ItemTest(this.masterService);
    Item.amount = randomBetween(1,4);
    return [Item];
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
