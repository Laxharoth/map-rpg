import { characterType } from "src/app/customTypes/characterTypes";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { MasterService } from "../../masterService";
import { PerkPoisonRush } from "../../Perk/PerkPoisonRush";
import { Character } from "../Character";
import { StatusBlind } from "../Status/StatusTemporal/Ailments/StatusBlind";
import { StatusInvisible } from "../Status/StatusTemporal/Ailments/StatusInvisible";
import { StatusPetrified } from "../Status/StatusTemporal/Ailments/StatusPetrified";
import { StatusProne } from "../Status/StatusTemporal/Ailments/StatusProne";
import { StatusRestrained } from "../Status/StatusTemporal/Ailments/StatusRestrained";
import { StatusSleep } from "../Status/StatusTemporal/Ailments/StatusSleep";
import { StatusPoison } from "../Status/StatusTemporal/StatusPoison";

export class enemyTest extends Character
{
  characterType:characterType = 'test enemy';
  constructor(masterService:MasterService)
  { super({
      hitpoints:100, energypoints:100,
      attack : 10, aim: 10, defence : 10, speed : 10, evasion : 10,
      },masterService)
      // this.addStatus(new StatusPoison(masterService))
      // this.addStatus(new StatusBlind(masterService));
      // this.addStatus(new StatusInvisible(masterService));
      // this.addStatus(new StatusPetrified(masterService));
      // this.addStatus(new StatusProne(masterService));
      // this.addStatus(new StatusRestrained(masterService));
      // this.addStatus(new StatusSleep(masterService));
      // this.addPerk(  new PerkPoisonRush(masterService));
  }
  get name(): string {
      return 'test enemy';
  }
  IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
      const target = randomBetween(0,ally.length-1);
      switch (randomBetween(0,2))
      {
          //ATTACK
          case 0: return this.Attack([ally[target]]);
          //RANGE
          case 1: return this.Shoot([ally[target]]);
          //DEFEND
          case 2: return this.Defend([this]);
          default: return [[],[]];
      }
  }
}
