import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusGrappled } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusGrappled";
import { StatusGrappling } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusGrappling";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class SpecialGrab extends SpecialAttack
{
  get name(): specialsname { return 'Grab' }
  get isPartyUsable(): boolean { return false }
  get isEnemyUsable(): boolean { return true }
  get isSelfUsable(): boolean { return false }
  get isSingleTarget(): boolean { return true }

  protected _itemEffect(user:Character,target: Character): ActionOutput {
      const description:ActionOutput = [[],[]];
      pushBattleActionOutput(user.addStatus(new StatusGrappling(this.masterService,target)),description)
      pushBattleActionOutput(target.addStatus(new StatusGrappled(this.masterService,user)),description)
      this.cooldown = 6;
      return description;
  }
}
