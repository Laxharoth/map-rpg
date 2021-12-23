import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { PersistentCharacter } from "src/gameLogic/custom/Class/Character/NPC/PersistentCharacter";
import { PerkCharm } from "src/gameLogic/custom/Class/Perk/PerkCharm";
import { PerkFright } from "src/gameLogic/custom/Class/Perk/PerkFright";
import { PerkGrappler } from "src/gameLogic/custom/Class/Perk/PerkGrappler";
import { TimedStatusTest } from "src/gameLogic/custom/Class/Status/TimedStatusTest";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { randomBetween } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class charTest extends PersistentCharacter
{
  protected _name!: string;
  characterType:characterType = "test character";
  constructor(masterService:MasterService ,name:string='')
  { super(masterService);
    this._name = name
    this.uuid = this._name;
    this.addPerk(new PerkCharm(masterService))
    this.addPerk(new PerkGrappler(masterService))
    this.addPerk(new PerkFright(masterService))
  }

  get name(): string { return this._name; }
  set name(name: string) { this._name = name;}
  _IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
      const target = randomBetween(0,enemy.length-1);
      switch (randomBetween(0,2))
      {
          //ATTACK
          case 0: return this.Attack([enemy[target]]);
          //RANGE
          case 1: return this.Shoot(enemy);
          //DEFEND
          case 2: return this.Defend([this]);
          default: return [[],[]];
      }
  }
}
