import { Character } from "src/app/classes/Character/Character";
import { StatusRangedAttack } from "src/app/classes/Character/Status/StatusTemporal/StatusRangedAttack";
import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Weapon } from "../Weapon";

export abstract class RangedWeapon extends Weapon
{
  protected damagestat(user   : Character):number{return user.stats.aim;}
  protected defencestat(target: Character):number{return target.stats.defence;}
  attack(user:Character,target:Character):battleActionOutput
  {
    const [descriptions,strings]=user.addStatus(new StatusRangedAttack(this.masterService));
    const [attackdescription,attackstring] =super.attack(user,target);
    descriptions.push(...attackdescription);
    strings.push(...attackstring);

    return [descriptions,strings];
  }
}
