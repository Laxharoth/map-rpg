import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
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
  uuid = this.characterType;
  constructor(masterService:MasterService ,name:string='')
  { super({
      hitpoints:200, energypoints:100,
      attack : 20, aim: 20, defence : 20, speed : 20, evasion : 20,
      },masterService);
      this._name = name
      this.addPerk(new PerkCharm(masterService))
      this.addPerk(new PerkGrappler(masterService))
      this.addPerk(new PerkFright(masterService))
      this.addStatus(new TimedStatusTest(masterService));
      masterService.gameSaver.register('PersistentCharacter',this)
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
