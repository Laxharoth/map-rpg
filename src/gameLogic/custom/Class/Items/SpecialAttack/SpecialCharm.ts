import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusCharm } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusCharm";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class SpecialCharm extends SpecialAttack
{
  get name(): specialsname { return 'Charm'; }
  get isPartyUsable(): boolean { return false; }
  get isEnemyUsable(): boolean { return true; }
  get isSelfUsable() : boolean { return false; }
  get isSingleTarget(): boolean { return true; }
  protected _itemEffect(user:Character,target: Character): ActionOutput {
    this.cooldown = 6;
    return target.addStatus(new StatusCharm(this.masterService,user,target))
  }
}
