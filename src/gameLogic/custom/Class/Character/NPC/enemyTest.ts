import { MasterService } from "src/app/service/master.service";
import { BattleCommand, EmptyCommand } from 'src/gameLogic/custom/Class/Battle/BattleCommand';
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { Enemy } from 'src/gameLogic/custom/Class/Character/Enemy/Enemy';
import { ItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { itemname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { randomBetween, randomCheck } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class enemyTest extends Character implements Enemy
{
  _name="enemyTest";
  enemy_type: string = "enemyTest";
  type:characterType = 'test enemy';
  constructor(masterService:MasterService)
  { super(masterService,'TestCharacterBattleClass') }
  get name(): string {
      return 'test enemy';
  }
  _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      const target = randomBetween(0,ally.length-1);
      switch (randomBetween(0,2))
      {
          //ATTACK
          case 0: return this.Attack([ally[target]]);
          //RANGE
          case 1: return this.Shoot([ally[target]]);
          //DEFEND
          case 2: return this.Defend([this]);
          default: return new EmptyCommand(this,[]);
      }
  }
  get loot():ItemStoreable[]
  {
    return [
      {
        Factory:'Item',
        type:this.select_loot(),
      }
    ]
  }
  base_experience: number = 20;

  private select_loot():itemname
  {
    if(randomCheck(10))return 'ShieldGuard'
    return 'item-test'
  }
}
