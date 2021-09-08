import { ActionOutput } from 'src/app/customTypes/customTypes';
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { Equipment } from "../Equipment";

export abstract class Shield extends Equipment{
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    const removedEquipment = user.shield
    user.shield = this;
    return pushBattleActionOutput(user.addItem(removedEquipment),output);
  }
}
