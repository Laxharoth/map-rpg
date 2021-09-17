import { ActionOutput } from 'src/app/customTypes/customTypes';
import { shieldname } from 'src/app/customTypes/itemnames';
import { tag } from 'src/app/customTypes/tags';
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { Equipment } from "../Equipment";

export abstract class Shield extends Equipment{
  abstract get name(): shieldname;
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    const removedEquipment = user.unequipShield();
    user.shield = this;
    return pushBattleActionOutput(removedEquipment,output);
  }
  get tags(): tag[] { return ['shield']}
}
