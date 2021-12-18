import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { randomBetween } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class enemyTest extends Character
{
  characterType:characterType = 'test enemy';
  constructor(masterService:MasterService)
  { super(masterService)
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
  _IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
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
