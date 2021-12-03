import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusFright } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusFright";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class SpecialFright extends SpecialAttack
{
  get name(): specialsname { return 'Fright' }
  get isPartyUsable(): boolean { return false }
  get isEnemyUsable(): boolean { return true }
  get isSelfUsable(): boolean { return false }
  get isSingleTarget(): boolean { return true }

  itemEffect(user:Character,target: Character): ActionOutput
  {
      const description:ActionOutput = [[],[]];
      pushBattleActionOutput(target.addStatus(new StatusFright(this.masterService,target,user)), description)
      this.cooldown=4;
      return pushBattleActionOutput(super.itemEffect(user,target), description);
  }
}
