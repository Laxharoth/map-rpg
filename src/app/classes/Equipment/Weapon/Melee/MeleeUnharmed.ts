import { Character } from "src/app/classes/Character/Character";
import { damageTypes } from "src/app/customTypes/customTypes";
import { MeleeWeapon } from "./MeleeWeapon";
import { tag } from 'src/app/customTypes/tags';
import { OnePunch } from "src/app/classes/Items/SpecialAttack/OnePunch";

export class MeleeUnharmed extends MeleeWeapon
{
  maxStack = 0;
  protected damageTypes: damageTypes = {bluntdamage:10} as damageTypes;
  protected accuracy: number = 100;
  get name(): string { return 'hand'; }
  canEquip(character: Character): boolean { return true; }
  applyModifiers(character: Character): void {
    character.addSpecialAttack(new OnePunch(this.masterService))
    character.stats.evasion += 30;
  }
  get tags(): tag[] { return ['melee unharmed']; }
  get isSingleTarget(): boolean { return true;}
}
