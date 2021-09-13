import { ActionOutput } from "src/app/customTypes/customTypes";
import { armorname } from "src/app/customTypes/equipmentnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { Equipment } from "../Equipment";

export abstract class Armor extends Equipment
{
  abstract get name():armorname;
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    const removedEquipment = user.unequipArmor();
    user.armor = this;
    return pushBattleActionOutput(removedEquipment,output);
  }
  get tags(): tag[] { return ['armor']; }
}
