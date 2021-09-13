import { Character } from "src/app/classes/Character/Character";
import { StatusRangedAttack } from "src/app/classes/Character/Status/StatusTemporal/StatusRangedAttack";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { rangedname } from "src/app/customTypes/equipmentnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput, randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { Weapon } from "../Weapon";

export abstract class RangedWeapon extends Weapon
{
  protected damagestat(user   : Character):number{return user.stats.aim;}
  protected defencestat(target: Character):number{return target.stats.defence;}
  abstract get name():rangedname;
  attack(user:Character,target:Character):ActionOutput
  {
    const [descriptions,strings]=user.addStatus(new StatusRangedAttack(this.masterService));
    const [attackdescription,attackstring] =super.attack(user,target);
    descriptions.push(...attackdescription);
    strings.push(...attackstring);
    return [descriptions,strings];
  }
  get tags(): tag[] { return ['ranged weapon']; }

  protected accuracyTest(user:Character,target:Character)
  {
    let accuracyFix = 0;
    if(user.hasTag('restrained')) accuracyFix-=20;
    return super.accuracyTest(user,target)+randomBetween(0,accuracyFix);
  }

  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    const removedEquipment = user.unequipRanged();
    user.rangedWeapon = this;
    return pushBattleActionOutput(removedEquipment,output);
  }
}
