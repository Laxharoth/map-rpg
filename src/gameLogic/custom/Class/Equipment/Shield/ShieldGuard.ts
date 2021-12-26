import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { ActionOutput } from "../../Character/Character.type";
import { shieldname } from "../../Items/Item.type";
import { StatusGuard } from "../../Status/StatusGuard";
import { Shield } from "./Shield";

export class ShieldGuard extends Shield
{
  get name(): shieldname {
    return "Guard Shield"
  }
  canEquip(character: Character): boolean {
    return true
  }
  defend(targets: Character[]): ActionOutput {
      const output = super.defend(targets);
      for(const target of targets) {
        pushBattleActionOutput(target.addStatus(new StatusGuard(this.masterService)),output)
      }
      return output;
  }
}
