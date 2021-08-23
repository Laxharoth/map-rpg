import { Character } from "src/app/classes/Character/Character";
import { Description } from "src/app/classes/Descriptions/Description";
import { battleActionOutput, damageTypes } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { RangedWeapon } from "./RangedWeapon";

export class RangedUnharmed extends RangedWeapon
{
  maxStack = 0;
  protected damageTypes: damageTypes;
  protected accuracy = 50;
  get name(): string {
    return 'a rock';
  }
  canEquip(character: Character): boolean { return true; }
  applyModifiers(character: Character): void {}
  get tags(): tag[] { return ['ranged unharmed']; }
  calculateDamage(user:Character,target:Character):number { return 10; }
  get isSingleTarget(): boolean { return true; }
}
