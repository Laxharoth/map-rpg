import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { shieldname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { StatusDefend } from "src/gameLogic/custom/Class/Status/StatusTemporal/StatusDefend";
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

/** Type of equipment, adds defend method. */
export abstract class Shield extends Equipment{
  readonly abstract type:shieldname
  abstract get name(): string;
  /** Equips into user shield */
  protected _itemEffect(user:Character,target: Character): ActionOutput
  {
    user.unequipShield();
    user.character_equipment.shield = this;
    return super._itemEffect(user, target);
  }
  /** Adds the StatusDefend to the character with the shield. */
  defend(targets:Character[]):ActionOutput
  {
    const output = [[],[]] as ActionOutput;
    for(const target of targets)
    {
      const statusOutput = target.addStatus(new StatusDefend(this.masterService));
      const reactionOutput = target.react(this.tags,target);
      pushBattleActionOutput(statusOutput,reactionOutput)
      pushBattleActionOutput(reactionOutput,output);
    }
    return output;
  }
  get tags(): tag[] { return ['shield']}
}

export class ShieldNoShield extends Shield
{
  readonly type:"ShieldNoShield"="ShieldNoShield"
  get name(): string { return 'No shield'; }
  canEquip(character: Character): boolean { return false; }
  get tags(): tag[] { return ['unequiped','no shield']; }
  get isSingleTarget(): boolean { return true; }
}
