import { ActionOutput } from 'src/app/customTypes/customTypes';
import { shieldname } from 'src/app/customTypes/itemnames';
import { tag } from 'src/app/customTypes/tags';
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { StatusDefend } from '../../Character/Status/StatusTemporal/StatusDefend';
import { Equipment } from "../Equipment";

export abstract class Shield extends Equipment{
  abstract get name(): shieldname;
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    user.unequipShield();
    user.shield = this;
    return output;
  }
  defend(target : Character):ActionOutput
  {
    const statusOutput = target.addStatus(new StatusDefend(this.masterService));
    const reactionOutput = target.react(this.tags,target);
    return pushBattleActionOutput(statusOutput,reactionOutput);
  }
  get tags(): tag[] { return ['shield']}
}
