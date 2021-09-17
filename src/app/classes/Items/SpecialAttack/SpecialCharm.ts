import { ActionOutput } from "src/app/customTypes/customTypes";
import { specialsname } from "src/app/customTypes/itemnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { StatusCharm } from "../../Character/Status/StatusTemporal/Ailments/StatusCharm";
import { SpecialAttack } from "./SpecialAttack";

export class SpecialCharm extends SpecialAttack
{
    get name(): specialsname { return 'Charm'; }
    get isPartyUsable(): boolean { return false; }
    get isEnemyUsable(): boolean { return true; }
    get isSelfUsableOnly(): boolean { return false; }
    get isSingleTarget(): boolean { return true; }
    itemEffect(user:Character,target: Character): ActionOutput {
      this.cooldown = 6;
      const itemDescription:ActionOutput = [[],[]]
      target.addStatus(new StatusCharm(this.masterService,user,target))
      return pushBattleActionOutput(super.itemEffect(user,target),itemDescription)
    }
}
