import { Character } from "src/app/classes/Character/Character";
import { randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { Weapon } from "../Weapon";

export abstract class MeleeWeapon extends Weapon
{
  protected damagestat(user   : Character):number{return user.stats.attack;}
  protected defencestat(target: Character):number{return target.stats.defence;}

  protected accuracyTest(user:Character,target:Character)
  {
    let accuracyFix = 0;
    if(target.hasTag('prone')) accuracyFix+=20;
    return super.accuracyTest(user,target)+randomBetween(0,accuracyFix);
  }
}
