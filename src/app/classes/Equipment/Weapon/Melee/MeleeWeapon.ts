import { Character } from "src/app/classes/Character/Character";
import { Weapon } from "../Weapon";

export abstract class MeleeWeapon extends Weapon
{
  protected damagestat(user   : Character):number{return user.stats.attack;}
  protected defencestat(target: Character):number{return target.stats.defence;}
}
